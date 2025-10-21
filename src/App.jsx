import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../Frontend/pages/register";
import Login from "../Frontend/pages/login";
import Profile from "../Frontend/pages/profile";
import Home from "../Frontend/pages/Home";
import ProtectedRoute from "../Frontend/protected/protectedRoute";
import AdminDashboard from "../Frontend/pages/AdminDashboard";
import CreateBlog from "../Frontend/pages/CreateBlog";
import MyBlogs from "../Frontend/pages/MyBlogs";
import EditBlogs from "../Frontend/pages/EditBlogs";
import ViewBlog from "../Frontend/pages/ViewBlogs"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* 🔒 Protected User Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-blog"
          element={
            <ProtectedRoute>
              <CreateBlog />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-blogs"
          element={
            <ProtectedRoute>
              <MyBlogs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-blog/:id"
          element={
            <ProtectedRoute>
              <EditBlogs />
            </ProtectedRoute>
          }
        />

        {/* ✅ Fixed Route (was /view-blogs/:id) */}
        <Route
          path="/view-blog/:id"
          element={
            <ProtectedRoute>
              <ViewBlog />
            </ProtectedRoute>
          }
        />

        {/* 🛠 Admin Protected Route */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
