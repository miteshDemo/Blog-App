import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../Frontend/pages/register";
import Login from "../Frontend/pages/login";
import Profile from "../Frontend/pages/profile";
import Home from "../Frontend/pages/Home";
import ProtectedRoute from "../Frontend/protected/protectedRoute";
import AdminDashboard from "../Frontend/pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* 🔒 Protected User Route */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 🛠 Admin Protected Route (optional) */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
