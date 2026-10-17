import { createTheme } from "@mui/material";

const form = "var(--font-form)";
const stamp = "var(--font-stamp)";
const rule = "#2a2d34";
const inkBlue = "#1f3b8c";
const stampRed = "#b7222a";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: inkBlue, dark: "#172c69", light: "#3d5bb5" },
    secondary: { main: rule },
    error: { main: stampRed },
    success: { main: inkBlue },
    background: { default: "#d4d5d7", paper: "#fbfbf8" },
    text: { primary: rule, secondary: "#4a4f5a" },
    divider: "#b9bdc6",
  },
  shape: { borderRadius: 2 },
  typography: {
    fontFamily: form,
    h1: { fontFamily: stamp, fontSize: "clamp(2rem, 4.2vw, 3.25rem)", fontWeight: 500, lineHeight: 1.35 },
    h2: { fontFamily: stamp, fontSize: "2rem", fontWeight: 500, lineHeight: 1.4 },
    h3: { fontFamily: stamp, fontSize: "1.75rem", fontWeight: 500, lineHeight: 1.4 },
    h4: { fontFamily: stamp, fontSize: "1.5rem", fontWeight: 500, lineHeight: 1.45 },
    h5: { fontFamily: stamp, fontSize: "1.25rem", fontWeight: 500, lineHeight: 1.5 },
    h6: { fontFamily: stamp, fontSize: "1.125rem", fontWeight: 500, lineHeight: 1.5 },
    subtitle1: { fontWeight: 700, lineHeight: 1.6 },
    body1: { fontSize: "1rem", lineHeight: 1.7 },
    body2: { fontSize: "0.9375rem", lineHeight: 1.65 },
    caption: { fontSize: "0.8125rem", lineHeight: 1.5 },
    button: { textTransform: "none", fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: { styleOverrides: { body: { backgroundColor: "#d4d5d7" } } },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: "none" },
        outlined: { border: `1px solid ${rule}` },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 2,
          padding: "9px 20px",
          minHeight: 44,
          fontSize: "1rem",
          boxShadow: "none",
        },
        containedPrimary: {
          backgroundColor: inkBlue,
          color: "#fbfbf8",
          "&:hover": { backgroundColor: "#172c69", boxShadow: "none" },
        },
        outlinedPrimary: {
          borderColor: rule,
          color: rule,
          "&:hover": { borderColor: rule, backgroundColor: "#f0f1ee" },
        },
        outlinedError: {
          borderColor: stampRed,
          "&:hover": { borderColor: stampRed },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          fontFamily: stamp,
          fontWeight: 500,
          border: `1px solid ${rule}`,
          backgroundColor: "transparent",
        },
        colorSuccess: { color: inkBlue, borderColor: inkBlue },
        colorWarning: { color: rule, borderStyle: "dashed" },
        colorError: { color: stampRed, borderColor: stampRed },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 0, backgroundColor: "#e3e5e9", border: `1px solid ${rule}` },
        bar: { borderRadius: 0, backgroundColor: inkBlue },
      },
    },
    MuiFormHelperText: {
      styleOverrides: { root: { fontSize: "0.8125rem", marginLeft: 0, lineHeight: 1.4 } },
    },
    MuiInputLabel: {
      styleOverrides: { root: { fontSize: "1rem", color: "#4a4f5a" } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          minHeight: 48,
          backgroundColor: "#fbfbf8",
          color: inkBlue,
          "& fieldset": { borderColor: rule, borderWidth: 1 },
          "&:hover fieldset": { borderColor: rule },
          "&.Mui-focused fieldset": { borderColor: inkBlue, borderWidth: 2 },
          "&.Mui-error fieldset": { borderColor: stampRed },
        },
        input: {
          fontSize: "1rem",
          padding: "12px 14px",
          "&::placeholder": { color: "#5b606b", opacity: 1 },
          "&:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 1000px #f0f1ee inset",
            WebkitTextFillColor: inkBlue,
          },
        },
      },
    },
    MuiTextField: { defaultProps: { size: "medium" } },
    MuiMenuItem: { styleOverrides: { root: { fontSize: "1rem" } } },
  },
});
