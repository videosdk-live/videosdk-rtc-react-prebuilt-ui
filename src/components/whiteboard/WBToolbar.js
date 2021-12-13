import {
  Box,
  ButtonBase,
  makeStyles,
  Popover,
  Tooltip,
  useTheme,
} from "@material-ui/core";
import React from "react";
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

const useStyles = makeStyles((theme) => ({
  btnTool: {
    padding: theme.spacing(1),
    marginTop: theme.spacing(1 / 2),
    marginBottom: theme.spacing(1 / 2),
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

const ToolBarIcon = ({
  Icon,
  onClick,
  title,
  isSelected,
  whiteboardToolbarWidth,
}) => {
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

const WBToolbar = ({
  setTool,
  downloadCanvas,
  clearCanvas,
  undo,
  zoomOut,
  zoomIn,
  tool,
  color,
  setColor,
  whiteboardToolbarWidth,
  whiteboardSpacing,
}) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const theme = useTheme();

  const open = Boolean(anchorEl);

  const { canDrawOnWhiteboard } = useMeetingAppContext();

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
        <Tooltip title="Change color" arrow placement="right">
          <ButtonBase
            className={classes.btnTool}
            color="inherit"
            component="span"
            style={{ borderRadius: 6 }}
          >
            <input
              type="color"
              value={color}
              id="color-picker"
              className={classes.iColorPicker}
              onChange={(ev) => setColor(ev.target.value)}
            />
          </ButtonBase>
        </Tooltip>
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
            title: "Clear whitebaord",
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
