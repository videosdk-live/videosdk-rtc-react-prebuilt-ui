import { responsiveFontSizes } from "@material-ui/core/styles";
import { createTheme } from "@material-ui/core/styles";

export default function generateMuiTheme(type, primary, secondary) {
  return responsiveFontSizes(
    createTheme({
      typography: {
        fontFamily: ["Inter", "Arial", "sans-serif"].join(","),
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
