import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../Frontend/pages/register";
import Login from "../Frontend/pages/login";
import Profile from "../Frontend/pages/profile";
import Home from "../Frontend/pages/Home"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;