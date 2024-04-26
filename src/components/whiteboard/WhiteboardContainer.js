import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { Box, IconButton, useTheme } from "@mui/material";
import { useSnackbar } from "notistack";
import { useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import { appThemes, useMeetingAppContext } from "../../MeetingAppContextDef";
import useIsMobile from "../../utils/useIsMobile";
import useIsTab from "../../utils/useIsTab";
import usePrevious from "../../utils/usePrevious";
import WBToolbar from "./WBToolbar";
import { invertColor, nameTructed } from "../../utils/common";
import useResponsiveSize from "../../utils/useResponsiveSize";
import Compressor from "compressorjs";
import CloseIcon from "@mui/icons-material/Close";

export const convertHWAspectRatio = ({
  height: containerHeight,
  width: containerWidth,
}) => {
  let width = containerWidth;
  let height = containerHeight;

  const currAspectRatio = containerWidth / containerHeight;
  const reqAspectRatio = 16 / 9;
  if (currAspectRatio > reqAspectRatio) {
    width = containerHeight * (16 / 9);
  } else {
    height = containerWidth / (16 / 9);
  }

  return { width, height };
};

function WhiteboardContainer({
  height,
  width,
  whiteboardToolbarWidth,
  whiteboardSpacing,
  originalHeight,
  originalWidth,
}) {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const isTab = useIsTab();

  const { enqueueSnackbar } = useSnackbar();

  const previousHeight = usePrevious(height);
  const previousWidth = usePrevious(width);

  // const initialHeight = useRef(height);
  const initialWidth = useRef(width);

  //
  const {
    whiteboardState,
    canDrawOnWhiteboard,
    animationsEnabled,
    canToggleWhiteboard,
    notificationAlertsEnabled,
    notificationSoundEnabled,
    appTheme,
    token,
  } = useMeetingAppContext();

  const mMeeting = useMeeting({});

  //
  const [pages, setpages] = useState(0);
  const [currentPageNo, setCurrentPageNo] = useState(1);
  const { publish } = usePubSub(`WB`);
  const [color, setColor] = useState(
    appTheme === appThemes.LIGHT || appTheme === appThemes.DARK
      ? theme.palette.lightTheme.primaryMain
      : theme.palette.primary.main
  );
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState(
    whiteboardState.state.config?.bgColor || "#f5f7f9"
  );
  const [uploading, setUploading] = useState(false);
  const [isLoadingCanvasData, setIsLoadingCanvasData] = useState(false);

  const [tool, _setTool] = useState(null);
  const toolRef = useRef(tool);
  const setTool = (data) => {
    toolRef.current = data;
    _setTool(data);
  };

  const imageWidth = useResponsiveSize({
    xl: 320,
    lg: 280,
    md: 240,
    sm: 200,
    xs: 180,
  });

  const imageHeight = (imageWidth * 9) / 16;

  //
  const fabricRef = useRef(null);
  const canvasCotainerRef = useRef(null);
  const pdfRef = useRef(null);
  const pageJSONRef = useRef({});

  useEffect(() => {
    switch (tool) {
      case "select": {
        fabricRef.current.isDrawingMode = false;
        fabricRef.current.isDragging = false;
        break;
      }

      case "pencil": {
        fabricRef.current.isDrawingMode = true;
        fabricRef.current.isDragging = false;
        break;
      }
      case "text": {
        fabricRef.current.isDrawingMode = false;
        fabricRef.current.isDragging = false;
        break;
      }

      case "circle": {
        fabricRef.current.isDrawingMode = false;
        fabricRef.current.isDragging = false;
        break;
      }

      case "square": {
        fabricRef.current.isDrawingMode = false;
        fabricRef.current.isDragging = false;
        break;
      }

      case "squareFilled": {
        fabricRef.current.isDrawingMode = false;
        fabricRef.current.isDragging = false;
        break;
      }

      case "pan": {
        fabricRef.current.isDrawingMode = false;
        fabricRef.current.fire("exitText", {});
        break;
      }
      default: {
        break;
      }
    }
  }, [tool]);

  // Canvas initialization

  useEffect(() => {
    // fabric overrides
    fabric.IText.prototype.keysMap[13] = "exitEditing";

    let canvas;

    // if (isHost) {
    if (canDrawOnWhiteboard) {
      canvas = new fabric.Canvas(document.getElementById("canvasId"), {
        selection: false,
        defaultCursor: "default",
      });
      canvas.freeDrawingBrush.width = 3;
    } else {
      canvas = new fabric.Canvas(document.getElementById("canvasId"), {});
    }

    // canvas.isDrawingMode = true; // default drawing tool

    canvas.on("mouse:down", (opt) => {
      if (toolRef.current === "pan") {
        canvas.isDragging = true;
        canvas.lastPosX = opt.e.clientX;
        canvas.lastPosY = opt.e.clientY;
      }
    });

    canvas.on("mouse:move", function (opt) {
      if (canvas.isDragging) {
        var e = opt.e;

        var vpt = canvas.viewportTransform;
        vpt[4] += e.clientX - canvas.lastPosX;
        vpt[5] += e.clientY - canvas.lastPosY;

        canvas.requestRenderAll();

        canvas.lastPosX = e.clientX;
        canvas.lastPosY = e.clientY;
      }
    });

    canvas.on("after:render", function () {
      canvas.calcOffset();
    });

    fabricRef.current = canvas;

    if (whiteboardState.started) {
      //
      const oldObjects = whiteboardState.state.objects;

      fabric.util.enlivenObjects(oldObjects, function (objects) {
        const origRenderOnAddRemove = canvas.renderOnAddRemove;
        canvas.renderOnAddRemove = false;

        for (const o of objects) {
          canvas.add(o);
        }

        canvas.renderOnAddRemove = origRenderOnAddRemove;
        canvas.renderAll();
      });

      //
      if (whiteboardState.state.zoom) {
        const zoom = convertZoomFrom800(whiteboardState.state.zoom);
        canvas.setZoom(zoom);
      } else {
        const zoom = convertZoomFrom800(1);

        canvas.setZoom(zoom);
      }

      if (whiteboardState.state.vpt) {
        const vpt = convertPanFrom800(whiteboardState.state.vpt);
        canvas.setViewportTransform(vpt);
      }

      setCanvasBackgroundColor(
        whiteboardState.state.config?.bgColor || "#F5F7F9"
      );

      canvas.renderAll();
    } else {
      canvas.setZoom(convertZoomFrom800(1));
      canvas.renderAll();
    }
  }, [whiteboardState]);

  useEffect(() => {
    if (canDrawOnWhiteboard) {
      fabricRef.current.freeDrawingBrush.color = color;
    }
  }, [color, canDrawOnWhiteboard]);

  // Drawing free line and adding text
  useEffect(() => {
    fabricRef.current.on("mouse:up", (event) => {
      //Pan
      if (toolRef.current === "pan") {
        fabricRef.current.setViewportTransform(
          fabricRef.current.viewportTransform
        );
        fabricRef.current.isDragging = false;
        let pan800 = convertPanTo800(fabricRef.current.viewportTransform);
        sendData({
          event: "PAN",
          data: pan800,
        });
      }

      // Add Text
      if (toolRef.current === "text") {
        addText(event.e);
        setTool("select");
      }

      // Add circle
      else if (toolRef.current === "circle") {
        addCircle(event.e);
        setTool("select");
      }

      // Add circle filled
      else if (toolRef.current === "circleFilled") {
        addCircleFilled(event.e);
        setTool("select");
      }

      // Add square
      else if (toolRef.current === "square") {
        addSquare(event.e);
        setTool("select");
      }

      // Add square filled
      else if (toolRef.current === "squareFilled") {
        addSquareFilled(event.e);
        setTool("select");
      }
    });

    fabricRef.current.on("object:added", (options) => {
      if (options.target.get("oId")) return;

      options.target.set({
        oId: Date.now(),
        pId: mMeeting.localParticipant.id,
      });
      sendData({
        event: "OBJ_ADD",
        data: options.target.toJSON(["oId", "pId"]),
      });
    });

    fabricRef.current.on("object:modified", (options) => {
      sendData({
        event: "OBJ_MOD",
        data: options.target.toJSON(["oId", "pId"]),
      });
    });
  }, []);

  usePubSub(`WB`, {
    onMessageReceived: ({ message }) => {
      const { event, data } = message;
      onChatMessage({ event: event, data: data });
    },
    onOldMessagesReceived: async (messages) => {
      for (let msg of messages) {
        const { message } = msg;
        if (message.event === "CLEAR") {
          fabricRef.current.clear();
          return;
        } else {
          setIsLoadingCanvasData(true);
          await onChatMessage({ event: message.event, data: message.data });
          setIsLoadingCanvasData(false);
        }
      }
    },
  });

  // Action on chat message
  async function onChatMessage({ event, data }) {
    switch (event) {
      case "PAN": {
        let newPanFrom800 = convertPanFrom800(data);
        fabricRef.current.setViewportTransform(newPanFrom800);
        break;
      }

      case "ZOOM": {
        const zoomLevel = data;
        if(zoomLevel >= 1){
        fabricRef.current.zoomToPoint(new fabric.Point(fabricRef.current.getWidth()/2, fabricRef.current.getHeight()/2), zoomLevel)
        }
        break;
      }

      case "CLEAR": {
        fabricRef.current.clear();
        // fabricRef.current.setBackgroundColor("#F5F7F9");

        //
        const p = mMeeting.participants.get(data);

        if (notificationSoundEnabled) {
          new Audio("/notification.mp3").play();
        }

        if (notificationAlertsEnabled) {
          enqueueSnackbar(
            `${
              p ? nameTructed(p.displayName, 15) : "You"
            } cleared the whiteboard 🗑️`,
            { autoHideDuration: 4000 }
          );
        }

        break;
      }

      case "OBJ_ADD": {
        const exists = fabricRef.current
          .getObjects()
          .some((o) => o.oId === data.oId);
        if (!exists) {
          await new Promise((accept, reject) => {
            fabric.util.enlivenObjects([data], function (objects) {
              const origRenderOnAddRemove = fabricRef.current.renderOnAddRemove;
              fabricRef.current.renderOnAddRemove = false;

              fabricRef.current.add(objects[0]);

              fabricRef.current.renderOnAddRemove = origRenderOnAddRemove;
              fabricRef.current.renderAll();
              accept();
            });
          });
        }

        break;
      }

      case "OBJ_MOD": {
        const objectToUpdate = fabricRef.current.getObjects().find((o) => {
          return o.oId === data.oId;
        });

        if (objectToUpdate) {
          objectToUpdate.set(data);
          objectToUpdate.setCoords();
          fabricRef.current.renderAll();
        }

        break;
      }

      case "OBJ_DEL": {
        const object = fabricRef.current
          .getObjects()
          .find((o) => o.oId === data);

        if (object) fabricRef.current.remove(object);
        break;
      }

      case "BG_COLOR": {
        setCanvasBackgroundColor(data);
        break;
      }

      case "BRUSH_COLOR": {
        setColor(data);
        break;
      }

      case "PDF_OPEN": {
        openPdf(data);
        break;
      }

      case "PDF_PAGE": {
        updatePage(data);
        break;
      }
    }
  }

  // Delete key listener
  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Delete") {
        const object = fabricRef.current.getActiveObject();
        if (!object) return;

        fabricRef.current.remove(object);
        sendData({ event: "OBJ_DEL", data: object.oId });
      }
    });
  }, []);

  function sendData({ event, data }) {
    publish({ event, data }, { persist: true });
  }

  useEffect(() => {
    // sendData({ event: "BG_COLOR", data: canvasBackgroundColor });
    setTool("pencil");
  }, []);

  // on canvas resize, set canvas zoom with objects
  useEffect(() => {
    if (height !== previousHeight || width !== previousWidth) {
      fabricRef.current.setZoom(
        convertZoomFrom800(width / initialWidth.current)
      );
    }
  }, [height, width, previousWidth, previousHeight]);

  function addText(ev) {
    var pointer = fabricRef.current.getPointer(ev);
    const text = new fabric.IText("Click to edit text", {
      left: pointer.x,
      top: pointer.y,
      fill: fabricRef.current.freeDrawingBrush.color,
      fontFamily: "sans-serif",
    });

    // fire this event if pan started
    fabricRef.current.on("exitText", (e) => {
      text.exitEditing();
    });

    fabricRef.current.add(text);
    fabricRef.current.renderAll();

    // text.enterEditing();
    // text.selectAll();
  }

  function addCircle(ev) {
    var pointer = fabricRef.current.getPointer(ev);
    var object = new fabric.Circle({
      radius: 15,
      fill: "rgba(0,0,0,0)",
      left: pointer.x,
      top: pointer.y,
      stroke: fabricRef.current.freeDrawingBrush.color,
      strokeWidth: 2,
    });
    fabricRef.current.add(object);
    fabricRef.current.setActiveObject(object);
    fabricRef.current.renderAll();
  }

  function addCircleFilled(ev) {
    var pointer = fabricRef.current.getPointer(ev);
    var object = new fabric.Circle({
      radius: 15,
      fill: fabricRef.current.freeDrawingBrush.color,
      left: pointer.x,
      top: pointer.y,
    });
    fabricRef.current.add(object);
    fabricRef.current.setActiveObject(object);
    fabricRef.current.renderAll();
  }

  function addSquare(ev) {
    var pointer = fabricRef.current.getPointer(ev);
    var object = new fabric.Rect({
      left: pointer.x,
      top: pointer.y,
      fill: "rgba(0,0,0,0)",
      stroke: fabricRef.current.freeDrawingBrush.color,
      strokeWidth: 2,
      width: 40,
      height: 40,
      strokeUniform: true,
    });
    fabricRef.current.add(object);
    fabricRef.current.setActiveObject(object);
    fabricRef.current.renderAll();
  }

  function addSquareFilled(ev) {
    var pointer = fabricRef.current.getPointer(ev);
    var object = new fabric.Rect({
      left: pointer.x,
      top: pointer.y,
      fill: fabricRef.current.freeDrawingBrush.color,
      width: 40,
      height: 40,
    });
    fabricRef.current.add(object);
    fabricRef.current.setActiveObject(object);
    fabricRef.current.renderAll();
  }

  function undo() {
    const object = fabricRef.current
      .getObjects()
      .filter((o) => o.pId === mMeeting.localParticipant.id)
      .pop();

    if (!object) return;

    fabricRef.current.remove(object);
    sendData({ event: "OBJ_DEL", data: object.oId });
  }

  function clearCanvas() {
    fabricRef.current.clear();
    sendData({
      event: "CLEAR",
      data: mMeeting.localParticipant.id,
    });
  }

  // // Update the selected object color when the color changes
  useEffect(() => {
    const activeObject = fabricRef.current.getActiveObject();

    if (activeObject) {
      if (activeObject.fill && activeObject.fill !== "rgba(0,0,0,0)") {
        activeObject.set({ fill: color });
      }

      // Check if the object has a stroke property
      if (activeObject.stroke) {
        activeObject.set({ stroke: color });
      }
      fabricRef.current.renderAll();
      sendData({
        event: "OBJ_MOD",
        data: activeObject.toJSON(["oId", "pId"]),
      });
    }
  }, [color]);

  async function uploadImageAndGetUrl({ event, image }) {
    setUploading(true);
    return new Promise((resolve, reject) => {
      let imageData = image ? image : event.target.files[0];

      new Compressor(imageData, {
        quality: 0.8,
        maxHeight: 1024,
        maxWidth: 1024,

        async success(result) {
          var formdata = new FormData();
          formdata.append("file", result, imageData.name);

          var requestOptions = {
            method: "POST",
            headers: {
              Authorization: token,
            },
            body: formdata,
            redirect: "follow",
          };

          try {
            const res = await fetch(
              `https://${mMeeting?.meeting?.baseUrl}/file-upload?roomId=${mMeeting.meetingId}`,
              requestOptions
            );

            const json = await res.json();

            return resolve(json.url);
          } catch (error) {
            console.log(error);
            return reject(error);
          }
        },
        error(err) {
          console.log(err.message);
        },
      });
    });
  }

  async function addImage(event) {
    const url = await uploadImageAndGetUrl({ event: event });
    fetch(url, { headers: { Authorization: token } }).then(async (res) => {
      // Create a new image element
      const image = new Image();
      image.onload = () => {
        const fabricImage = new fabric.Image(image);

        //create an extra var for to change some image properties
        var image1 = fabricImage.set({
          left: whiteboardSpacing,
          top: 42,
        });
        fabricImage.scaleToWidth(imageWidth);
        fabricRef.current.add(image1);
        fabricRef.current.setActiveObject(image1);
        fabricRef.current.renderAll();
      };
      const binaryData = await res.arrayBuffer();
      //converting array buffer to string
      const base64Data = window.btoa(
        new Uint8Array(binaryData).reduce(function (data, byte) {
          return data + String.fromCharCode(byte);
        }, "")
      );
      image.src = `data:image/*;base64,${base64Data}`;
      setUploading(false);
    });
  }

  async function addImageFromPaste(event) {
    if (event.clipboardData && event.clipboardData.items) {
      for (let i = 0; i < event.clipboardData.items.length; i++) {
        let item = event.clipboardData.items[i];
        if (item.type.indexOf("image") !== -1) {
          const image = item.getAsFile();
          const url = await uploadImageAndGetUrl({ image: image });
          setTool("select");
          fetch(url, { headers: { Authorization: token } }).then(
            async (res) => {
              const image = new Image();
              image.onload = () => {
                const fabricImage = new fabric.Image(image);
                var image1 = fabricImage.set({
                  left: whiteboardSpacing,
                  top: 42,
                });
                fabricImage.scaleToWidth(imageWidth);
                if (fabricRef.current) {
                  fabricRef.current.add(image1);
                  fabricRef.current.setActiveObject(image1);
                  fabricRef.current.renderAll();
                }
              };
              const binaryData = await res.arrayBuffer();
              const base64Data = window.btoa(
                new Uint8Array(binaryData).reduce(function (data, byte) {
                  return data + String.fromCharCode(byte);
                }, "")
              );
              image.src = `data:image/*;base64,${base64Data}`;
              setUploading(false);
            }
          );
        }
      }
    }
  }

  useEffect(() => {
    const handlePaste = function (event) {
      addImageFromPaste(event);
    };
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  function changeCanvasBackgroundColor(color) {
    sendData({ event: "BG_COLOR", data: color });
  }

  function changeBrushColor(color) {
    sendData({ event: "BRUSH_COLOR", data: color });
  }

  function zoomIn() {
    const currentZoom = fabricRef.current.getZoom();
    const newZoom = currentZoom + 0.2;
    fabricRef.current.fire("exitText", {});
    sendData({ event: "ZOOM", data:newZoom  });
  }

  function zoomOut() {
    const currentZoom = fabricRef.current.getZoom();
    const newZoom = currentZoom - 0.2;
    fabricRef.current.fire("exitText", {});
    sendData({ event: "ZOOM", data:newZoom });
  }

  function openPdf(url) {
    let loadingTask = window.PDFJS.getDocument(url);

    loadingTask.promise.then(function (pdf) {
      pdfRef.current = pdf;
      setpages(pdf.numPages);
      loadPageNo(currentPageNo);
    });
  }

  function loadPageNo(number) {
    pdfRef.current.getPage(number).then(function (page) {
      var viewport = page.getViewport(2.0);
      var canvasEl = document.getElementById("pdf-canvas");
      canvasEl.height = viewport.height;
      canvasEl.width = viewport.width;

      page
        .render({
          canvasContext: canvasEl.getContext("2d"),
          viewport: viewport,
        })
        .then(function () {
          var bg = canvasEl.toDataURL("image/png");
          fabric.Image.fromURL(bg, (img) => {
            if (img.width > img.height) {
              img.scaleToWidth(fabricRef.current.width);
            }

            if (img.height > img.width) {
              img.scaleToHeight(fabricRef.current.height);
            }

            fabricRef.current.setBackgroundImage(img, () => {
              fabricRef.current.renderAll();
            });
          });
        });
    });
  }

  // function sharePdf(url) {
  //   openPdf(url);
  //   sendData({ event: "PDF_OPEN", data: url });
  // }

  // function handlePageChange(ev) {
  //   const newPage = ev === "next" ? currentPageNo + 1 : currentPageNo - 1;

  //   if (newPage < 1 || newPage > pages) return;

  //   updatePage(newPage);
  //   sendData({ event: "PDF_PAGE", data: newPage });
  // }

  function updatePage(newPage) {
    pageJSONRef.current[currentPageNo] = fabricRef.current.toJSON();
    fabricRef.current.clear();

    setCurrentPageNo(newPage);

    if (pageJSONRef.current[newPage]) {
      fabricRef.current.loadFromJSON(
        pageJSONRef.current[newPage],
        fabricRef.current.renderAll.bind(fabricRef.current)
      );
    } else {
      loadPageNo(newPage);
    }
  }

  //   async function uploadPdf(file) {
  //     const formData = new FormData();
  //     formData.append("pdf", file, file.name);

  //     const req = await fetch("/somUrl", {
  //       method: "POST",
  //       body: formdata,
  //     });
  //     const fileUrl = await req.json();
  //     sharePdf(fileUrl);
  //   }

  function downloadCanvas() {
    // set background
    fabricRef.current.setBackgroundColor(canvasBackgroundColor || "#F5F7F9");
    // set zoomIn
    const currentZoom = fabricRef.current.getZoom();
    const newZoom = currentZoom - 0.4;
    fabricRef.current.fire("exitText", {});
    fabricRef.current.setZoom(newZoom);
    // convert canvas to image
    let uri = fabricRef.current.toDataURL({ format: "jpg" });
    let link = document.createElement("a");
    link.href = uri;
    link.download = `${Date.now()}-canvas.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // remove background
    fabricRef.current.setBackgroundColor("transparent");
    // set zoomOut
    const currentZoom1 = fabricRef.current.getZoom();
    const newZoom1 = currentZoom1 + 0.4;
    fabricRef.current.fire("exitText", {});
    fabricRef.current.setZoom(newZoom1);
  }

  function convertZoomTo800() {
    let currentCanvasWidth = fabricRef.current.getWidth();
    let currentZoom = fabricRef.current.getZoom();
    return (800 * currentZoom) / currentCanvasWidth;
  }

  function convertZoomFrom800(zoom) {
    let currentCanvasWidth = fabricRef.current.getWidth();
    return (currentCanvasWidth * zoom) / 800;
  }

  function convertPanTo800(pan) {
    let currentCanvasWidth = fabricRef.current.getWidth();
    let zoom = convertZoomTo800();
    let copyPan = [...pan];
    copyPan[0] = zoom;
    copyPan[3] = zoom;
    copyPan[4] = (800 * pan[4]) / currentCanvasWidth;
    copyPan[5] = (800 * pan[5]) / currentCanvasWidth;
    return copyPan;
  }

  function convertPanFrom800(pan) {
    let currentCanvasWidth = fabricRef.current.getWidth();
    let zoom = convertZoomFrom800(pan[0]);
    let copyPan = [...pan];
    copyPan[0] = zoom;
    copyPan[3] = zoom;
    copyPan[4] = (currentCanvasWidth * pan[4]) / 800;
    copyPan[5] = (currentCanvasWidth * pan[5]) / 800;
    return copyPan;
  }

  const space = isMobile ? 20 : isTab ? 32 : 48;
  const arrXLength = Math.floor(width / space);
  const arrYLength = Math.floor(height / space);

  const dotBoxHeight = arrYLength * space;
  const dotBoxWidth = arrXLength * space;

  const dotBoxTop = (height - dotBoxHeight) / 2;
  const dotBoxLeft = width - dotBoxWidth - 24;

  const arrX = Array(arrXLength + 1).fill(0);
  const arrY = Array(arrYLength + 1).fill(0);

  useEffect(() => {
    if (tool === "pan") {
      fabricRef.current.defaultCursor = "grabbing";
    } else {
      fabricRef.current.defaultCursor = "default";
    }
  }, [tool]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if Ctrl (or Command on Mac) key is pressed along with Z key
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        // Prevent the default undo behavior (like browser navigation)
        e.preventDefault();
        undo();
      }
    };

    // Add event listener for keydown
    document.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Box
      id={"main-canvas-container"}
      style={{
        width: originalWidth,
        height: originalHeight,
        display: "flex",
        backgroundColor: canvasBackgroundColor || "#F5F7F9",
        transition: animationsEnabled
          ? "height 800ms, width 800ms"
          : "height 400ms, width 400ms",
      }}
    >
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          width: whiteboardToolbarWidth + 2 * whiteboardSpacing,
          position: "relative",
        }}
      >
        <WBToolbar
          {...{
            setTool,
            downloadCanvas,
            clearCanvas,
            changeCanvasBackgroundColor,
            changeBrushColor,
            undo,
            zoomOut,
            zoomIn,
            tool,
            color,
            setColor,
            canvasBackgroundColor: canvasBackgroundColor || "#F5F7F9",
            setCanvasBackgroundColor,
            whiteboardToolbarWidth,
            whiteboardSpacing,
            addImage,
          }}
        />
      </Box>

      <Box
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Box
          style={{
            position: "relative",
            width,
            height,
            transition: animationsEnabled
              ? "height 800ms, width 800ms"
              : undefined,
          }}
        >
          <div
            style={{
              width: width,
              height: height,
              position: "relative",
              backgroundColor: canvasBackgroundColor || "#F5F7F9",
              transition: animationsEnabled
                ? "height 800ms, width 800ms"
                : undefined,
            }}
            ref={canvasCotainerRef}
          >
            <canvas
              id="canvasId"
              width={width}
              height={height}
              style={{
                width: width,
                height: height,
                borderRadius: theme.spacing(1),
                transition: animationsEnabled
                  ? "height 800ms, width 800ms"
                  : undefined,
                zIndex: 100,
              }}
            />
            <div
              style={{
                position: "absolute",
                width: dotBoxWidth,
                height: dotBoxHeight,
                top: dotBoxTop,
                left: dotBoxLeft,
                transition: animationsEnabled
                  ? "height 800ms, width 800ms"
                  : undefined,
                pointerEvents: "none",
              }}
            >
              {arrX.map((_, itemx) =>
                arrY.map((_, itemy) => (
                  <Box
                    key={`dot_${itemx}_${itemy}`}
                    style={{
                      position: "absolute",
                      top: itemy * space,
                      left: itemx * space,
                      height: 4,
                      width: 4,
                      backgroundColor: invertColor(
                        canvasBackgroundColor || "#F5F7F9"
                      ),
                      transform: "translate(-2px, -2px)",
                      borderRadius: 2,
                      opacity: 0.3,
                    }}
                  />
                ))
              )}
            </div>
          </div>
          <canvas
            style={{
              display: "none",
              transition: animationsEnabled
                ? "height 800ms, width 800ms"
                : undefined,
            }}
            id="pdf-canvas"
          />

          {!canDrawOnWhiteboard && (
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                backgroundColor: "transparent",
                zIndex: 1000,
              }}
            ></div>
          )}
        </Box>

        {isLoadingCanvasData && (
          <Box
            style={{
              position: "absolute",
              top: 16,
              left: "40%",
              zIndex: 999,
              paddingLeft: "10px",
              paddingRight: "10px",
              backgroundColor: "black",
              borderRadius: "4px",
            }}
          >
            <p
              style={{
                fontSize: "16px",
                marginBottom: "8px",
                marginTop: "8px",
                color: "white",
              }}
            >
              Loading Canvas Data...
            </p>
          </Box>
        )}

        {uploading && (
          <Box
            style={{
              position: "absolute",
              top: 16,
              left: "40%",
              zIndex: 999,
              paddingLeft: "10px",
              paddingRight: "10px",
              backgroundColor: "black",
              borderRadius: "4px",
            }}
          >
            <p
              style={{
                fontSize: "16px",
                marginBottom: "8px",
                marginTop: "8px",
                color: "white",
              }}
            >
              Uploading Image ...
            </p>
          </Box>
        )}
        {canToggleWhiteboard && (
          <Box
            style={{ position: "absolute", top: 16, right: 16, zIndex: 999 }}
          >
            <IconButton
              onClick={() => {
                mMeeting.meeting.stopWhiteboard();
              }}
              style={{
                cursor: "pointer",
                backgroundColor: theme.palette.lightTheme.three,
                padding: 8,
                margin: 0,
              }}
            >
              <CloseIcon
                fontSize={"small"}
                style={{
                  color:
                    appTheme === appThemes.LIGHT || appTheme === appThemes.DARK
                      ? theme.palette.lightTheme.contrastText
                      : theme.palette.common.black,
                }}
              />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
}

const MemoizedWhiteBoard = React.memo(
  WhiteboardContainer,
  ({ height, width }, { height: oldHeight, width: oldWidth }) =>
    height === oldHeight && width === oldWidth
);

export default MemoizedWhiteBoard;
