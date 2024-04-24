import { useTheme } from "@mui/material";
import { appThemes, meetingLayouts } from "../MeetingAppContextDef";

export default function RecordingLoader({ meetingLayout, appTheme }) {
  const theme = useTheme();

  const spacing = 10;

  return (
    <div
      style={{
        backgroundColor:
          appTheme === appThemes.LIGHT
            ? theme.palette.lightTheme.main
            : appTheme === appThemes.DARK
            ? theme.palette.darkTheme.main
            : theme.palette.background.default,
        width: "calc(100vw)",
        height: "calc(100vh)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `calc(100vw - ${spacing * 2}px)`,
          height: `calc(100vh - ${spacing * 2}px)`,
          overflow: "hidden",
          margin: spacing,
        }}
      >
        {meetingLayout === meetingLayouts.SPOTLIGHT ? (
          <div
            className={`loading-skeleton-anime ${
              appTheme === appThemes.LIGHT
                ? "loading-skeleton-anime-light"
                : appTheme === appThemes.DARK
                ? "loading-skeleton-anime-dark"
                : "loading-skeleton-anime-default"
            }`}
            style={{
              height: `calc(100% - ${spacing * 4}px)`,
              width: `calc(100% - ${spacing * 4}px)`,
              borderRadius: 8,
              margin: spacing * 2,
              backgroundColor:
                appTheme === appThemes.LIGHT
                  ? theme.palette.lightTheme.two
                  : appTheme === appThemes.DARK
                  ? theme.palette.darkTheme.slightLighter
                  : theme.palette.background.paper,
            }}
          ></div>
        ) : meetingLayout === meetingLayouts.GRID ? (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", flex: 1 }}>
              {[0, 1].map((index) => (
                <div
                  key={index}
                  className={`loading-skeleton-anime ${
                    appTheme === appThemes.LIGHT
                      ? "loading-skeleton-anime-light"
                      : appTheme === appThemes.DARK
                      ? "loading-skeleton-anime-dark"
                      : "loading-skeleton-anime-default"
                  }`}
                  style={{
                    margin: spacing,
                    borderRadius: 8,
                    backgroundColor:
                      appTheme === appThemes.LIGHT
                        ? theme.palette.lightTheme.two
                        : appTheme === appThemes.DARK
                        ? theme.palette.darkTheme.slightLighter
                        : theme.palette.background.paper,
                  }}
                ></div>
              ))}
            </div>
            <div style={{ display: "flex", flex: 1 }}>
              {[0, 1].map((index) => (
                <div
                  key={index}
                  className={`loading-skeleton-anime ${
                    appTheme === appThemes.LIGHT
                      ? "loading-skeleton-anime-light"
                      : appTheme === appThemes.DARK
                      ? "loading-skeleton-anime-dark"
                      : "loading-skeleton-anime-default"
                  }`}
                  style={{
                    margin: spacing,
                    borderRadius: 8,
                    backgroundColor:
                      appTheme === appThemes.LIGHT
                        ? theme.palette.lightTheme.two
                        : appTheme === appThemes.DARK
                        ? theme.palette.darkTheme.slightLighter
                        : theme.palette.background.paper,
                  }}
                ></div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ height: "100%", width: "100%", display: "flex" }}>
            <div
              className={`loading-skeleton-anime ${
                appTheme === appThemes.LIGHT
                  ? "loading-skeleton-anime-light"
                  : appTheme === appThemes.DARK
                  ? "loading-skeleton-anime-dark"
                  : "loading-skeleton-anime-default"
              }`}
              style={{
                display: "flex",
                flex: 1,
                margin: 24,
                borderRadius: 8,
                backgroundColor:
                  appTheme === appThemes.LIGHT
                    ? theme.palette.lightTheme.two
                    : appTheme === appThemes.DARK
                    ? theme.palette.darkTheme.slightLighter
                    : theme.palette.background.paper,
              }}
            ></div>
            <div
              className={`loading-skeleton-anime ${
                appTheme === appThemes.LIGHT
                  ? "loading-skeleton-anime-light"
                  : appTheme === appThemes.DARK
                  ? "loading-skeleton-anime-dark"
                  : "loading-skeleton-anime-default"
              }`}
              style={{
                borderRadius: 8,
                height: "25%",
                width: "20%",
                marginTop: 24,
                marginRight: 24,
                backgroundColor:
                  appTheme === appThemes.LIGHT
                    ? theme.palette.lightTheme.two
                    : appTheme === appThemes.DARK
                    ? theme.palette.darkTheme.slightLighter
                    : theme.palette.background.paper,
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
