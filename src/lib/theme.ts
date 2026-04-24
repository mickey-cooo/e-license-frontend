import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1565C0",
      light: "#1E88E5",
      dark: "#0D47A1",
    },
    secondary: {
      main: "#F2B632",
      light: "#FFE082",
      dark: "#C48F00",
    },
    background: {
      default: "#FFFFFF",
      paper: "#F5F7FB",
    },
    text: {
      primary: "#111827",
      secondary: "#4B5563",
    },
  },
  typography: {
    fontFamily: " sans-serif",
    h1: {
      fontSize: "3.88rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "3.5rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "2.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h5: {
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.6,
    },
    h6: {
      fontSize: "1.60rem",
      fontWeight: 600,
      lineHeight: 1.7,
    },
    body1: {
      fontSize: "1.5rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.95rem",
      lineHeight: 1.43,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 16px",
          fontSize: "0.95rem",
          fontWeight: 500,
          textTransform: "none",
          boxShadow: "none",
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: "0.75rem",
          marginTop: 4,
          lineHeight: 1.2,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          label: {
            fontSize: "0.9rem",
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "& fieldset": {
              borderColor: "rgba(0, 0, 0, 0.23)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(0, 0, 0, 0.23)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "rgba(0, 0, 0, 0.23)",
              borderWidth: 1,
            },
            "& input::placeholder": {
              fontSize: "0.9rem",
            },
            "& input": {
              fontSize: "0.9rem",
            },
          },
          "& .MuiOutlinedInput-input:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 1000px #F5F7FB inset",
            WebkitTextFillColor: "inherit",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          minHeight: 40,
          background: "#F5F7FB",
        },
        input: {
          fontSize: "0.9rem",
          padding: "10px 12px",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "transparent",
          },
          ":active": {
            backgroundColor: "transparent",
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#64B5F6",
      light: "#90CAF9",
      dark: "#1976D2",
    },
    secondary: {
      main: "#F2B632",
      light: "#FFD54F",
      dark: "#C49000",
    },
    error: {
      main: "#EF5350",
    },
    background: {
      default: "#020617",
      paper: "#020818",
    },
    text: {
      primary: "#E5E7EB",
      secondary: "#9CA3AF",
    },
  },
});
