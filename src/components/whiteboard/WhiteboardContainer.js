import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { Box, Chip, useTheme } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { useMeeting } from "@videosdk.live/react-sdk";
import { useMeetingAppContext } from "../../MeetingAppContextDef";
import useIsMobile from "../../utils/useIsMobile";
import useIsTab from "../../utils/useIsTab";
import usePrevious from "../../utils/usePrevious";
import WBToolbar from "./WBToolbar";
import { invertColor, nameTructed } from "../../utils/common";
import useResponsiveSize from "../../utils/useResponsiveSize";

var fetch = require("node-fetch");
let fs = require("fs");

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

  const [stringImageSrc, setStringImageSrc] = useState();

  const stringImageSrcRef = useRef();

  useEffect(() => {
    stringImageSrcRef.current = stringImageSrc;
  }, [stringImageSrc]);

  // const initialHeight = useRef(height);
  const initialWidth = useRef(width);

  //
  const { whiteboardState, canDrawOnWhiteboard } = useMeetingAppContext();
  const mMeeting = useMeeting({});

  //
  const [pages, setpages] = useState(0);
  const [currentPageNo, setCurrentPageNo] = useState(1);
  const [color, setColor] = useState(theme.palette.primary.main);
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState(
    whiteboardState.state.config?.bgColor || "#f5f7f9"
  );

  const [tool, _setTool] = useState(null);
  const toolRef = useRef(tool);
  const setTool = (data) => {
    toolRef.current = data;
    _setTool(data);
  };

  const cardWidth = useResponsiveSize({
    xl: 320,
    lg: 280,
    md: 240,
    sm: 200,
    xs: 180,
  });

  const cardHeight = (cardWidth * 9) / 16;

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

    // fabric.Image.prototype.toObject = (function (toObject) {
    //   return function () {
    //     return fabric.util.object.extend(toObject.call(this), {
    //       src: this.toDataURL(),
    //     });
    //   };
    // })(fabric.Image.prototype.toObject);

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

      const data = options.target.toJSON(["oId", "pId"]);

      if (data.type === "image") {
        sendData({
          event: "OBJ_ADD",
          data: data,
        });
      }
    });

    fabricRef.current.on("object:modified", (options) => {
      sendData({
        event: "OBJ_MOD",
        data: options.target.toJSON(["oId", "pId"]),
      });
    });
  }, []);

  //   Event Listner for chat messages
  useEffect(() => {
    mMeeting.meeting.on("chat-message", (message) => {
      const { senderId, text } = message;

      const { type, data: msgData } = JSON.parse(text);
      if (type !== "WB") return;

      const isLocal = senderId === mMeeting.localParticipant.id;

      if (isLocal) return;

      onChatMessage(msgData);
    });
  }, []);

  // Action on chat message
  async function onChatMessage({ event, data }) {
    switch (event) {
      case "PAN": {
        let newPanFrom800 = convertPanFrom800(data);
        fabricRef.current.setViewportTransform(newPanFrom800);
        break;
      }

      case "ZOOM": {
        const newZoom = convertZoomFrom800(data);
        fabricRef.current.setZoom(newZoom);
        break;
      }

      case "CLEAR": {
        fabricRef.current.clear();
        // fabricRef.current.setBackgroundColor("#F5F7F9");

        //
        const p = mMeeting.participants.get(data);
        new Audio("/notification.mp3").play();
        enqueueSnackbar(
          `${
            p ? nameTructed(p.displayName, 15) : "You"
          } cleared the whiteboard 🗑️`,
          { autoHideDuration: 4000 }
        );

        break;
      }

      case "OBJ_ADD": {
        const exists = fabricRef.current
          .getObjects()
          .some((o) => o.oId === data.oId);

        // console.log(data.src, data.type, "before data.src");

        // if (data.type === "image") {
        //   var url = data.imageDataURL;

        //   console.log("url");

        //   const res = await fetch(url);

        //   console.log(res);

        //   const blob = await res.blob();

        //   console.log(blob);

        //   // console.log(
        //   //   "Urls",
        //   //   URL.createObjectURL(blob),
        //   //   URL.createObjectURL(data.src),
        //   //   data.src
        //   // );

        //   data.src = data.imageDataURL; // = `${data.imageDataURL}`; //URL.createObjectURL()
        // }

        if (!exists) {
          fabric.util.enlivenObjects([data], function (objects) {
            const origRenderOnAddRemove = fabricRef.current.renderOnAddRemove;
            fabricRef.current.renderOnAddRemove = false;

            // console.log(objects, "objects obj_add");

            fabricRef.current.add(objects[0]);

            fabricRef.current.renderOnAddRemove = origRenderOnAddRemove;
            fabricRef.current.renderAll();
            // console.log("OBJ_ADDDDDDDDDDDDDD");
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
    mMeeting.sendChatMessage(
      JSON.stringify({ type: "WB", data: { event, data } })
    );
  }

  useEffect(() => {
    sendData({ event: "BG_COLOR", data: canvasBackgroundColor });
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

    //fire this event if pan started
    fabricRef.current.on("exitText", (e) => {
      text.exitEditing();
    });

    fabricRef.current.add(text);
    fabricRef.current.renderAll();

    text.enterEditing();
    text.selectAll();
  }

  function addCircle(ev) {
    var pointer = fabricRef.current.getPointer(ev);
    var object = new fabric.Circle({
      radius: 15,
      fill: fabricRef.current.freeDrawingBrush.color,
      left: pointer.x,
      top: pointer.y,
      fill: "rgba(0,0,0,0)",
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
    // fabricRef.current.setBackgroundColor("white");
    sendData({ event: "CLEAR", data: mMeeting.localParticipant.id });
  }

  const useFromURL = () => {
    // fabric.Image.prototype.toDatalessObject = fabric.Image.prototype.toObject;
    // fabric.Image.prototype.toObject = (function (toObject) {
    //   return function () {
    //     return fabric.util.object.extend(toObject.call(this), {
    //       src: this.toDataURL(),
    //     });
    //   };
    // })(fabric.Image.prototype.toObject);
  };

  function getDataUrl(img) {
    // create image

    const image = document.createElement("img");
    image.src = img;

    // console.log(image, img, "image");

    // Create canvas

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    // Set width and height
    canvas.width = image.width;
    canvas.height = image.height;
    // Draw the image
    ctx.drawImage(image, 0, 0);

    // console.log(ctx);

    return canvas.toDataURL("image/jpeg");
  }

  async function addImage(event) {
    // const image = event.target.files[0];

    // const c = document.getElementById("canvasId");
    // const canvas = new fabric.Canvas(c, {
    //   selection: false,
    //   defaultCursor: "default",
    // });
    // const url = "https://i.imgur.com/KxijB.jpg";
    // fabric.Image.fromURL(
    //   url,
    //   (img) => {
    //     canvas.add(img);
    //   },
    //   {
    //     crossOrigin: "annonymous",
    //   }
    // );

    // fabric.Image.prototype.toDatalessObject = fabric.Image.prototype.toObject;
    // fabric.Image.prototype.toObject = (function (toObject) {
    //   return function () {
    //     return fabric.util.object.extend(toObject.call(this), {
    //       src: this.toDataURL(),
    //     });
    //   };
    // })(fabric.Image.prototype.toObject);

    // return canvas;

    // const canvas = useFromURL();

    // console.log("canvas", canvas.toJSON());

    // const url = "https://i.imgur.com/KxijB.jpg";
    // const img = new Image();
    // img.src = url;
    // const fabricImage = new fabric.Image(img, {});
    // fabricRef.current.add(fabricImage);

    // fabric.Image.prototype.toObject = (function (toObject) {
    //   return function () {
    //     return fabric.util.object.extend(toObject.call(this), {
    //       src: this.toDataURL(),
    //     });
    //   };
    // })(fabric.Image.prototype.toObject);

    // const dataurl = getDataUrl(event.target.files[0]);

    // console.log(dataurl, "dataurl");

    // new fabric.Image.fromElement()
    new fabric.Image.fromURL(
      URL.createObjectURL(event.target.files[0]),
      //   "https://images.unsplash.com/photo-1583062482795-d2bef78e9bc1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      async function (myImg) {
        //create an extra var for to change some image properties
        var img1 = myImg.set({
          left: whiteboardSpacing,
          top: 42,
        });

        // console.log(img1.toDataURL(), "img1.toDataURL()");

        // img1.setSrc(img1.toObject());

        // img1.set(); //setSrc();

        const imageWIdth = cardWidth; //  img1.height;
        // const imageWIdth = img1.width;
        // const cardHeight = imageHeight;
        const imageHeight = (imageWIdth * img1.height) / img1.width;

        myImg.scaleToWidth(imageHeight);
        myImg.scaleToHeight(imageWIdth);

        console.log(img1, "img1");

        const dataURL = img1.toDataURL();

        const originalHeight = img1._element.height;
        const originalWidth = img1._element.width;

        console.log({
          originalHeight,
          originalWidth,
          imageHeight,
          imageWIdth,
        });

        img1.src = dataURL;
        // img1.width = originalWidth;
        // (img1.height = originalHeight),
        //   (img1.width = originalWidth),
        img1._element.src = dataURL;
        img1._element.height = originalHeight / imageHeight;
        img1._element.width = originalWidth / imageWIdth;
        // img1._element.style = `height: ${imageHeight}; width:${imageWIdth}; transform: scale(100);`;
        // img1._element.transform = `scale(${originalWidth / imageWIdth})`;

        // img1._element.naturalHeight = imageHeight;
        // img1._element.naturalWidth = imageWIdth;

        img1._originalElement.src = dataURL;
        img1._originalElement.height = originalHeight / imageHeight;
        img1._originalElement.width = originalWidth / imageWIdth;
        // img1._originalElement.style = `height: ${imageHeight}; width:${imageWIdth}; transform: scale(100);`;

        // img1._originalElement.naturalHeight = imageHeight;
        // img1._originalElement.naturalWidth = imageWIdth;

        // console.log(, "img1._element");

        fabricRef.current.add(img1);
        fabricRef.current.setActiveObject(img1);
        fabricRef.current.renderAll();
        // img1.setSourcePath(img1.toDataURL());

        const data = img1.toJSON(["oId", "pId"]);
        // data.src = img1.toDataURL();
        // img1.setSourcePath

        sendData({
          event: "OBJ_ADD",
          data: { ...data },
        });
      }
    );
  }

  function changeCanvasBackgroundColor(color) {
    sendData({ event: "BG_COLOR", data: color });
  }

  function zoomIn() {
    const currentZoom = fabricRef.current.getZoom();
    const newZoom = currentZoom + 0.2;
    fabricRef.current.fire("exitText", {});
    fabricRef.current.setZoom(newZoom);
    const newCalculatedZoom800 = convertZoomTo800();
    sendData({ event: "ZOOM", data: newCalculatedZoom800 });
  }

  function zoomOut() {
    const currentZoom = fabricRef.current.getZoom();
    const newZoom = currentZoom - 0.2;
    fabricRef.current.fire("exitText", {});
    fabricRef.current.setZoom(newZoom);
    const newCalculatedZoom800 = convertZoomTo800();
    sendData({ event: "ZOOM", data: newCalculatedZoom800 });
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
    let uri = fabricRef.current.toDataURL({ format: "png" });
    let link = document.createElement("a");
    link.href = uri;
    link.download = `${Date.now()}-canvas.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  return (
    <Box
      id={"main-canvas-container"}
      style={{
        width: originalWidth,
        height: originalHeight,
        display: "flex",
        backgroundColor: canvasBackgroundColor || "#F5F7F9",
        transition: "height 800ms, width 800ms",
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
            addImage,
            changeCanvasBackgroundColor,
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
            transition: "height 800ms, width 800ms",
          }}
        >
          <div
            style={{
              width: width,
              height: height,
              position: "relative",
              backgroundColor: canvasBackgroundColor || "#F5F7F9",
              transition: "height 800ms, width 800ms",
            }}
            ref={canvasCotainerRef}
          >
            <div
              style={{
                position: "absolute",
                width: dotBoxWidth,
                height: dotBoxHeight,
                top: dotBoxTop,
                left: dotBoxLeft,
                transition: "height 800ms, width 800ms",
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
              <img alt={"image"} src={stringImageSrc} height={100} />
            </div>
            <canvas
              id="canvasId"
              width={width}
              height={height}
              style={{
                width: width,
                height: height,
                borderRadius: theme.spacing(1),
                transition: "height 800ms, width 800ms",
                zIndex: 100,
              }}
            />
          </div>
          <canvas
            style={{ display: "none", transition: "height 800ms, width 800ms" }}
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

        <div style={{ position: "absolute", top: 16, left: 16 }}>
          <Chip
            label="BETA"
            color="primary"
            size="medium"
            style={{
              color: theme.palette.primary.main,
              backgroundColor: "#D5E8FF",
              fontSize: 18,
              fontWeight: "bold",
            }}
          />
        </div>
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
