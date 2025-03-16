import Container from "@mui/material/Container";
import HomePage from "./pages/HomePage/HomePage.jsx";
import { ThemeProvider, createTheme } from "@mui/material/styles";

let portfolio = createTheme({
  palette: {
    default: {
      white: "#FFFFFF",
      grey: "#444444",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            backgroundColor: "#D3D3D3",
            color: "#808080",
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          "&:last-child": {
            paddingBottom: 16,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          margin: 16,
        },
      },
    },
  },
  typography: {
    fontFamily: ["Oswald Variable", "Arial", "sans-serif"].join(","),
    fontSize: 18,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 550,
      md: 750,
      lg: 1200,
      xl: 1432,
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={portfolio}>
      <Container
        disableGutters
        maxWidth="md"
        sx={{
          px: 2,
        }}
      >
        <HomePage />
      </Container>
    </ThemeProvider>
  );
};

export default App;
