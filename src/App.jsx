import HomePage from "./pages/home/home.jsx";
import Container from "@mui/material/Container";
import { ThemeProvider, createTheme } from "@mui/material/styles";

let portfolio = createTheme({
  palette: {
    default: {
      main: "#ffffff",
      light: "#faf9f6",
      dark: "#c2c2c2",
      white: "#ffffff",
      black: "#444444",
      contrastText: "#444444",
    },
  },
  components: {
    MuiCardContent: {
      styleOverrides: {
        root: {
          "&:last-child": {
            paddingBottom: 16,
          },
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
      md: 900,
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
