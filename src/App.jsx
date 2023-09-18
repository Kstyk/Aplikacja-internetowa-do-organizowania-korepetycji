import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/AccessComponents/PrivateRoute";
import TeacherAllowed from "./components/AccessComponents/TeacherAllowed";
import StudentAllowed from "./components/AccessComponents/StudentAllowed";
import ProfilePage from "./pages/ProfilePage";
import { AuthProvider } from "./context/AuthContext";
import { NotificationContextProvider } from "./context/NotificationContext";
import { RoomProvider } from "./context/RoomContext";
import RegistrationPage from "./pages/RegistrationPage";
import StartedRoomsPage from "./pages/StartedRoomsPage";
import Room from "./components/RoomComponents/Room";
import SearchClassesPage from "./pages/SearchClassesPage";
import ClassesPage from "./pages/ClassesPage";
import BuyClassesPage from "./pages/BuyClassesPage";
import TeacherPage from "./pages/TeacherPage";
import EditBaseProfile from "./pages/EditBaseProfile";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import EditMoreInfosPage from "./pages/EditMoreInfosPage";
import ChangeAvatarPage from "./pages/ChangeAvatarPage";
import StudentProfilePage from "./pages/StudentProfilePage";
import PurchaseHistoryPage from "./pages/PurchaseHistoryPage";
import { ToastContainer } from "react-toastify";
import ReceivedOpinions from "./pages/ReceivedOpinions";
import StudentPage from "./pages/StudentPage";
import ModifyTimeslotsPage from "./pages/ModifyTimeslotsPage";
import CreateClassesPage from "./pages/CreateClassesPage";

function App() {
  return (
    <div
      data-theme="mytheme"
      className="flex flex-col w-8/12 mx-auto max-md:w-11/12 max-lg:w-10/12 max-sm:w-full"
    >
      <AuthProvider>
        <NotificationContextProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route element={<TeacherAllowed />}>
              <Route
                path="/profil"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profil/otrzymane-opinie"
                element={
                  <PrivateRoute>
                    <ReceivedOpinions />
                  </PrivateRoute>
                }
              />
              <Route
                path="/plan/edytuj"
                element={
                  <PrivateRoute>
                    <ModifyTimeslotsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/zajecia/dodaj"
                element={
                  <PrivateRoute>
                    <CreateClassesPage />
                  </PrivateRoute>
                }
              />
            </Route>
            <Route element={<StudentAllowed />}>
              <Route
                path="/profil-ucznia"
                element={
                  <PrivateRoute>
                    <StudentProfilePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profil/historia-zakupow"
                element={
                  <PrivateRoute>
                    <PurchaseHistoryPage />
                  </PrivateRoute>
                }
              />
            </Route>
            <Route
              path="/profil/edytuj"
              element={
                <PrivateRoute>
                  <EditBaseProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/profil/zmien-haslo"
              element={
                <PrivateRoute>
                  <ChangePasswordPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profil/edytuj-dodatkowe"
              element={
                <PrivateRoute>
                  <EditMoreInfosPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profil/edytuj-avatar"
              element={
                <PrivateRoute>
                  <ChangeAvatarPage />
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
              path="/pokoj/:roomId"
              element={
                <PrivateRoute>
                  <RoomProvider>
                    <Room />
                  </RoomProvider>
                </PrivateRoute>
              }
            />
            <Route path="/search-classes" element={<SearchClassesPage />} />
            <Route
              path="/search-classes/language/:languageSlug"
              element={<SearchClassesPage />}
            />
            <Route
              path="/search-classes/city/:citySlug"
              element={<SearchClassesPage />}
            />
            <Route
              path="/search-classes/text/:searchText"
              element={<SearchClassesPage />}
            />
            <Route path="/classes/:classesId" element={<ClassesPage />} />
            <Route
              path="/classes/:classesId/buy"
              element={<BuyClassesPage />}
            />
            <Route path="/nauczyciel/:teacherId" element={<TeacherPage />} />
            <Route path="/student/:studentId" element={<StudentPage />} />
            <Route path="*" element={<HomePage />} /> // dla nieistniejących url
          </Routes>
          <ToastContainer
            position="bottom-right"
            autoClose={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            theme="light"
          />
        </NotificationContextProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
