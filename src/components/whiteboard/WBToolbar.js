import {
  Box,
  ButtonBase,
  makeStyles,
  Popover,
  Tooltip,
  useTheme,
} from "@material-ui/core";
import { Palette, FormatColorFill } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import {
  CircleFilledIcon,
  CircleIcon,
  ClearWhiteboardIcon,
  PanAroundIcon,
  PencilIcon,
  PointerIcon,
  SaveImageIcon,
  ShapeIcon,
  SquareIcon,
  TextIcon,
  UndoIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "../../icons";
import { useMeetingAppContext } from "../../MeetingAppContextDef";
import { SketchPicker } from "react-color";
import { invertColor } from "../../utils/common";
import UploadImageIcon from "../../icons/UploadImageIcon";

const useStyles = makeStyles((theme) => ({
  btnTool: {
    padding: theme.spacing(1),
    marginTop: theme.spacing(1 / 4),
    marginBottom: theme.spacing(1 / 4),
  },
  iColorPicker: {
    width: "24px",
    height: "26px",
    padding: "0px",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
  },
  popover: {
    backgroundColor: "transparent",
    boxShadow: "none",
  },
  paper: {
    backgroundColor: "transparent",
    boxShadow: "none",
  },
}));

const ToolBarIcon = ({ Icon, onClick, title, isSelected }) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Tooltip title={title} arrow placement="right">
      <ButtonBase
        className={classes.btnTool}
        color="inherit"
        style={{
          backgroundColor: isSelected ? "#D5E8FF" : "",
          borderRadius: 6,
          // height: whiteboardToolbarWidth - 16,
          // width: whiteboardToolbarWidth - 16,
        }}
        onClick={onClick}
      >
        <Icon
          // height={whiteboardToolbarWidth - 16}
          // width={whiteboardToolbarWidth - 16}
          fill={isSelected ? theme.palette.primary.main : "black"}
        />
      </ButtonBase>
    </Tooltip>
  );
};

const CustomColorPicker = ({
  title,
  colorPicker,
  setColorPicker,
  color,
  setColor,
  setParentColor,
  changeCanvasBackgroundColor,
  whiteboardToolbarWidth,
  whiteboardSpacing,
  Icon,
}) => {
  const classes = useStyles();

  return (
    <>
      <Tooltip title={title} arrow placement="right">
        <ButtonBase
          className={classes.btnTool}
          color="inherit"
          component="span"
          style={{ borderRadius: 6 }}
          onClick={(e) => {
            setColorPicker(e.currentTarget);
          }}
          style={{
            backgroundColor: `#D5E8FF`,
            borderRadius: 6,
          }}
        >
          <Icon
            height={24}
            width={24}
            style={{ height: 24, width: 24, color }}
            fill={color}
          />
        </ButtonBase>
      </Tooltip>

      <Popover
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={Boolean(colorPicker)}
        anchorEl={colorPicker}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={() => {
          setColorPicker(null);
        }}
        disableRestoreFocus
      >
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "transparent",
            paddingLeft: whiteboardToolbarWidth + whiteboardSpacing,
            paddingRight: whiteboardSpacing,
            paddingBottom: whiteboardSpacing,
          }}
        >
          <Box
            style={{
              backgroundColor: "white",
              boxShadow: "0px 5px 10px #00000029",
            }}
          >
            <SketchPicker
              color={color}
              onChange={(ev) => {
                setColor(ev.hex);
              }}
              onChangeComplete={(ev) => {
                setParentColor(ev.hex);
                if (changeCanvasBackgroundColor) {
                  changeCanvasBackgroundColor(ev.hex);
                }
              }}
            />
          </Box>
        </Box>
      </Popover>
    </>
  );
};

const WBToolbar = ({
  setTool,
  downloadCanvas,
  clearCanvas,
  addImage,
  changeCanvasBackgroundColor,
  undo,
  zoomOut,
  zoomIn,
  tool,
  color: parentColor,
  setColor: setParentColor,
  canvasBackgroundColor: parentCanvasBackgroundColor,
  setCanvasBackgroundColor: setParentCanvasBackgroundColor,
  whiteboardToolbarWidth,
  whiteboardSpacing,
}) => {
  const classes = useStyles();

  const [color, setColor] = useState(parentColor);
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState(
    parentCanvasBackgroundColor
  );

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [colorPicker, setColorPicker] = useState(null);
  const [backgroundColorPicker, setBackgroundColorPicker] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const theme = useTheme();

  const open = Boolean(anchorEl);

  const { canDrawOnWhiteboard } = useMeetingAppContext();

  useEffect(() => {
    setColor(parentColor);
    setCanvasBackgroundColor(parentCanvasBackgroundColor);
  }, [parentColor, parentCanvasBackgroundColor]);

  return (
    canDrawOnWhiteboard && (
      <Box
        style={{
          position: "absolute",
          top: whiteboardSpacing,
          left: whiteboardSpacing,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          boxShadow: "0px 5px 10px #00000029",
          alignItems: "center",
          width: whiteboardToolbarWidth,
        }}
      >
        <ToolBarIcon
          {...{
            Icon: PointerIcon,
            onClick: () => setTool("select"),
            title: "Select object",
            isSelected: tool === "select",
            whiteboardToolbarWidth,
          }}
        />
        <ToolBarIcon
          {...{
            Icon: PencilIcon,
            onClick: () => setTool("pencil"),
            title: "Pen",
            isSelected: tool === "pencil",
            whiteboardToolbarWidth,
          }}
        />
        <ToolBarIcon
          {...{
            Icon: TextIcon,
            onClick: () => setTool("text"),
            title: "Text",
            isSelected: tool === "text",
            whiteboardToolbarWidth,
          }}
        />
        <>
          <ButtonBase
            className={classes.btnTool}
            onMouseEnter={handlePopoverOpen}
            style={{
              backgroundColor:
                tool === "square" ||
                tool === "squareFilled" ||
                tool === "circle" ||
                tool === "circleFilled"
                  ? "#D5E8FF"
                  : "",
              borderRadius: 6,
            }}
          >
            {tool === "square" ? (
              <SquareIcon fill={theme.palette.primary.main} />
            ) : tool === "squareFilled" ? (
              <ShapeIcon fill={theme.palette.primary.main} />
            ) : tool === "circle" ? (
              <CircleIcon fill={theme.palette.primary.main} />
            ) : tool === "circleFilled" ? (
              <CircleFilledIcon fill={theme.palette.primary.main} />
            ) : (
              <ShapeIcon fill={"#000"} />
            )}
          </ButtonBase>

          <Popover
            className={classes.popover}
            classes={{
              paper: classes.paper,
            }}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
          >
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "transparent",
                paddingLeft: whiteboardToolbarWidth + whiteboardSpacing,
                paddingRight: whiteboardSpacing,
                paddingBottom: whiteboardSpacing,
              }}
              onMouseLeave={handlePopoverClose}
            >
              <Box
                style={{
                  backgroundColor: "white",
                  boxShadow: "0px 5px 10px #00000029",
                }}
              >
                <Box style={{ display: "flex", flexDirection: "row" }}>
                  <ToolBarIcon
                    {...{
                      Icon: SquareIcon,
                      onClick: () => setTool("square"),
                      title: "Square",
                      isSelected: tool === "square",
                      whiteboardToolbarWidth,
                    }}
                  />
                  <ToolBarIcon
                    {...{
                      Icon: ShapeIcon,
                      onClick: () => setTool("squareFilled"),
                      title: "Square Filled",
                      isSelected: tool === "squareFilled",
                      whiteboardToolbarWidth,
                    }}
                  />
                </Box>
                <Box style={{ display: "flex", flexDirection: "row" }}>
                  <ToolBarIcon
                    {...{
                      Icon: CircleIcon,
                      onClick: () => setTool("circle"),
                      title: "Circle",
                      isSelected: tool === "circle",
                      whiteboardToolbarWidth,
                    }}
                  />
                  <ToolBarIcon
                    {...{
                      Icon: CircleFilledIcon,
                      onClick: () => setTool("circleFilled"),
                      title: "Circle Filled",
                      isSelected: tool === "circleFilled",
                      whiteboardToolbarWidth,
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Popover>
        </>
        <ToolBarIcon
          {...{
            Icon: PanAroundIcon,
            onClick: () => setTool("pan"),
            title: "Pan around",
            isSelected: tool === "pan",
            whiteboardToolbarWidth,
          }}
        />

        <CustomColorPicker
          {...{
            title: "Choose Color",
            colorPicker: colorPicker,
            setColorPicker: setColorPicker,
            setColor: setColor,
            color: color,
            setParentColor: setParentColor,
            whiteboardToolbarWidth: whiteboardToolbarWidth,
            whiteboardSpacing: whiteboardSpacing,
            Icon: FormatColorFill,
          }}
        />

        <ToolBarIcon
          {...{
            Icon: ZoomInIcon,
            onClick: () => zoomIn(),
            title: "Zoom In",
            isSelected: tool === "zoom",
            whiteboardToolbarWidth,
          }}
        />
        <ToolBarIcon
          {...{
            Icon: ZoomOutIcon,
            onClick: () => zoomOut(),
            title: "Zoom Out",
            isSelected: tool === "zoom",
            whiteboardToolbarWidth,
          }}
        />
        <CustomColorPicker
          {...{
            title: "Choose background",
            colorPicker: backgroundColorPicker,
            setColorPicker: setBackgroundColorPicker,
            setColor: setCanvasBackgroundColor,
            color: canvasBackgroundColor,
            setParentColor: setParentCanvasBackgroundColor,
            changeCanvasBackgroundColor: changeCanvasBackgroundColor,
            whiteboardToolbarWidth: whiteboardToolbarWidth,
            whiteboardSpacing: whiteboardSpacing,
            Icon: Palette,
          }}
        />
        <Tooltip title="Add Image" arrow placement="right">
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              display: "inline-block",
              cursor: "pointer",
            }}
          >
            <ButtonBase
              className={classes.btnTool}
              color="inherit"
              style={{
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              <UploadImageIcon />
            </ButtonBase>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                // const image = e.target.files[0];
                // const buffer = await image.arrayBuffer();
                // const imageString = Buffer.from(buffer).toString("utf8");

                // addImage(imageString);

                addImage(e);
              }}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                opacity: 0,
                width: "32px",
                height: "32px",
                cursor: "pointer",
              }}
            />
          </div>
        </Tooltip>
        <ToolBarIcon
          {...{
            Icon: UndoIcon,
            onClick: () => undo(),
            title: "Undo last drawing",
            isSelected: tool === "undo",
            whiteboardToolbarWidth,
          }}
        />
        <ToolBarIcon
          {...{
            Icon: ClearWhiteboardIcon,
            onClick: () => clearCanvas(),
            title: "Clear whiteboard",
            isSelected: tool === "clear",
            whiteboardToolbarWidth,
          }}
        />
        <ToolBarIcon
          {...{
            Icon: SaveImageIcon,
            onClick: () => downloadCanvas(),
            title: "Save as image",
            isSelected: tool === "save",
            whiteboardToolbarWidth,
          }}
        />
      </Box>
    )
  );
};

export default WBToolbar;
