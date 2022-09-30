import { responsiveFontSizes } from "@material-ui/core/styles";
import { createTheme } from "@material-ui/core/styles";

export default function generateMuiTheme(type, primary, secondary) {
  return responsiveFontSizes(
    createTheme({
      typography: {
        fontFamily: ["Roboto,sans-serif"].join(","),
      },

      palette: {
        type: "dark",
        text: { primary: "#fff", secondary: "#9fa0a7" },
        success: { main: "#4aa96c" },
        error: { main: "#D32F2F" },
        divider: "#3B3A48",
        background: {
          default: "#212032",
          paper: "#333244",
        },
        primary: {
          main: "#1178F8",
        },
        darkTheme: {
          one: "#FFFFFF",
          two: "#EFEFEF",
          three: "#DADADA",
          four: "#818181",
          five: "#6F767E",
          six: "#404B53",
          seven: "#232830", //"#26282C", //"#2B3034",
          slightLighter: "#1A1C22",
          main: "#050A0E",
          eight: "#26282C",
          contrastText: "#95959E",
        },
        lightTheme: {
          main: "#FFFFFF", //"#F3F4F8",
          two: "#EEF0F2",
          three: "#D3D7DA", //"#CCD2DB",
          four: "#8896A4",
          five: "#6F767E",
          six: "#404B53",
          seven: "#2B3034",
          eight: "#1A1C22",
          nine: "#050A0E",
          outlineColor: "#D3D7DA",
          contrastText: "#404B53",
          primaryMain: "#596BFF",
        },
        secondary: {
          main: "#000",
          contrastText: "#fff",
        },
        common: { white: "#fff", black: "#000", sidePanel: "#3D3C4E" },
      },
      overrides: {
        MuiTypography: {
          root: { color: "#fff" },
        },
        MuiTooltip: {
          tooltip: {
            fontSize: "1rem",
            color: "#fff",
            backgroundColor: "#000",
          },
        },
      },
    })
  );
}
