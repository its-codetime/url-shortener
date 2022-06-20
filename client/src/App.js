import Typography from "@mui/material/Typography";
import { Routes, Route, Navigate } from "react-router-dom";

// auth context
import { useAuth } from "./context/AuthContext";

import { UrlContextProvider } from "./context/UrlContext.js";

// pages
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import PasswordResetCreate from "./pages/auth/PasswordResetCreate";
import PasswordResetUpdate from "./pages/auth/PasswordResetUpdate";

import UrlList from "./pages/urlShortener/UrlList";
import AddUrl from "./pages/urlShortener/AddUrl";
import { Button } from "@mui/material";

function App() {
  const {
    user,
    login,
    register,
    logout,
    createPasswordReset,
    verifyPasswordReset,
    updatePassword,
  } = useAuth(); // handles auth

  return (
    <div className="App">
      <header>
        <Typography
          sx={{ margin: 2 }}
          align="center"
          gutterBottom
          variant="h2"
          component="h1"
        >
          Url Shortener
        </Typography>
        {user && (
          <Button
            size="large"
            sx={{ position: "absolute", top: 10, right: 10, color: "red" }}
            onClick={() => logout()}
          >
            Logout
          </Button>
        )}
      </header>
      <main>
        {user === null ? (
          <Routes>
            <Route
              path="/register"
              element={<Register register={register} />}
            />
            <Route path="/login" element={<Login login={login} />} />
            <Route
              path="/password-reset/create"
              element={
                <PasswordResetCreate
                  createPasswordReset={createPasswordReset}
                />
              }
            />
            <Route
              path="/password-reset/update/:resetToken"
              element={
                <PasswordResetUpdate
                  updatePassword={updatePassword}
                  verifyPasswordReset={verifyPasswordReset}
                />
              }
            />
            <Route path="*" element={<Navigate to="/register" />} />
          </Routes>
        ) : (
          <UrlContextProvider>
            <Routes>
              <Route
                path="/urls/all"
                element={<UrlList user={user} logout={logout} />}
              />
              <Route
                path="/urls/add"
                element={<AddUrl user={user} logout={logout} />}
              />
              <Route path="*" element={<Navigate to="/urls/all" />} />
            </Routes>
          </UrlContextProvider>
        )}
      </main>
    </div>
  );
}

export default App;
