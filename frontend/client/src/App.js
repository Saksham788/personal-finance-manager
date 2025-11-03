import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) setIsAuthenticated(true);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Always open login first */}
        <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />

        {/* Public Routes */}
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/register"
          element={<Register setIsAuthenticated={setIsAuthenticated} />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
