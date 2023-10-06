import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage/index";
import ProfilePage from "scenes/profilePage";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles"
import { themeSettings } from "theme";

function App() {
  const mode = useSelector(state => state.mode);
  const isAuth = useSelector(state => state.token);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route exact path="/" element={<LoginPage />} />
            <Route 
            exact path="/home"
            element={isAuth?<HomePage />:<Navigate to="/"/>} 
            />
            <Route
            exact path="/profile/:userId" 
            element={isAuth?<ProfilePage />:<Navigate to="/"/>} 
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
