import { useTheme } from "@material-ui/core";
import ReactPlayer from "react-player";

const PlayerViewer = ({ downstreamUrl }) => {
  console.log("playerViewer", downstreamUrl);
  const theme = useTheme();
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        position: "relative",
        overflow: "hidden",
        borderRadius: theme.spacing(1),
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {downstreamUrl ? (
          <ReactPlayer
            playsinline
            playIcon={<></>}
            pip={false}
            light={false}
            controls={false}
            muted={true}
            playing={true}
            url={downstreamUrl}
            height={"100%"}
            width={"100%"}
            style={
              {
                // backgroundColor: "pink",
                // filter: isLocal ? "blur(1rem)" : undefined,
              }
            }
            onError={(err) => {
              console.log(err, "hls video error");
            }}
          />
        ) : (
          <h1 style={{ color: "white" }}>HEllo</h1>
        )}
      </div>
    </div>
  );
};

export default PlayerViewer;
