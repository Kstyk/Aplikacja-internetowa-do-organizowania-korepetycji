import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import PrivateRoute from "./utils/PrivateRoute";
import ProfilePage from "./pages/ProfilePage";
import { AuthProvider } from "./context/AuthContext";
import RegistrationPage from "./pages/RegistrationPage";
import CreateRoomPage from "./pages/CreateRoomPage";
import StartedRoomsPage from "./pages/StartedRoomsPage";
import Room from "./components/Room";
import Chat from "./components/Chat";

function App() {
  return (
    <div className="flex flex-col bg-slate-300 w-screen h-screen">
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-room"
            element={
              <PrivateRoute>
                <CreateRoomPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-rooms"
            element={
              <PrivateRoute>
                <StartedRoomsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/rooms/:roomId"
            element={
              <PrivateRoute>
                <Room />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
