import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import Navbar from './components/GeneralComponents/Navbar'
import PrivateRoute from './components/AccessComponents/PrivateRoute'
import TeacherAllowed from './components/AccessComponents/TeacherAllowed'
import StudentAllowed from './components/AccessComponents/StudentAllowed'
import ProfilePage from './pages/ProfilePage'
import { AuthProvider } from './context/AuthContext'
import { NotificationContextProvider } from './context/NotificationContext'
import { RoomProvider } from './context/RoomContext'
import RegistrationPage from './pages/RegistrationPage'
import StartedRoomsPage from './pages/StartedRoomsPage'
import Room from './components/RoomComponents/Room'
import SearchClassesPage from './pages/SearchClassesPage'
import ClassesPage from './pages/ClassesPage'
import BuyClassesPage from './pages/BuyClassesPage'
import TeacherPage from './pages/TeacherPage'
import EditBaseProfile from './pages/EditBaseProfile'
import ChangePasswordPage from './pages/ChangePasswordPage'
import EditMoreInfosPage from './pages/EditMoreInfosPage'
import ChangeAvatarPage from './pages/ChangeAvatarPage'
import StudentProfilePage from './pages/StudentProfilePage'
import PurchaseHistoryPage from './pages/PurchaseHistoryPage'
import { ToastContainer } from 'react-toastify'
import ReceivedOpinions from './pages/ReceivedOpinions'
import StudentPage from './pages/StudentPage'
import ModifyTimeslotsPage from './pages/ModifyTimeslotsPage'
import CreateClassesPage from './pages/CreateClassesPage'
import ListOfTeachersClassesPage from './pages/ListOfTeachersClassesPage'
import EditClassesPage from './pages/EditClassesPage'
import AnonymousRoute from './components/AccessComponents/AnonymousRoute'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import TeacherSchedulePage from './pages/TeacherSchedulePage'
import StudentSchedulePage from './pages/StudentSchedulePage'
import AddedOpinionsPage from './pages/AddedOpinionsPage'
import TeacherPurchaseHistoryPage from './pages/TeacherPurchaseHistoryPage'
import InboxPage from './pages/InboxPage'
import AskAboutClassesPage from './pages/AskAboutClassesPage'
import SendedQuestionsAboutClassesPage from './pages/SendedQuestionsAboutClassesPage'
import ReceivedQuestionsAboutClassesPage from './pages/ReceivedQuestionsAboutClassesPage'
import BuyClassesPageAfterAsk from './pages/BuyClassesPageAfterAsk'
import Footer from './components/GeneralComponents/Footer'
import { useLocation } from 'react-router-dom'

function App() {
  let location = useLocation()
  return (
    <div
      data-theme="corporate"
      className="mx-auto flex w-full flex-col sm:w-11/12 md:w-10/12 lg:w-8/12"
    >
      <AuthProvider>
        <NotificationContextProvider>
          <Navbar />
          <div className="min-h-[calc(100vh-70px)] max-sm:bg-base-300 max-sm:px-3">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/logowanie"
                element={
                  <AnonymousRoute>
                    <LoginPage />{' '}
                  </AnonymousRoute>
                }
              />
              <Route
                path="/rejestracja"
                element={
                  <AnonymousRoute>
                    <RegistrationPage />
                  </AnonymousRoute>
                }
              />
              <Route
                path="/zapomniane-haslo"
                element={
                  <AnonymousRoute>
                    <ForgotPasswordPage />{' '}
                  </AnonymousRoute>
                }
              />
              <Route
                path="/resetuj-haslo/:token"
                element={
                  <AnonymousRoute>
                    <ResetPasswordPage />
                  </AnonymousRoute>
                }
              />
              {/* Only Teacher allowed */}
              <Route element={<TeacherAllowed />}>
                <Route path="/profil">
                  <Route
                    exact
                    path=""
                    element={
                      <PrivateRoute>
                        <ProfilePage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="zakupione-zajecia"
                    element={
                      <PrivateRoute>
                        <TeacherPurchaseHistoryPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="otrzymane-opinie"
                    element={
                      <PrivateRoute>
                        <ReceivedOpinions />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="harmonogram"
                    element={
                      <PrivateRoute>
                        <TeacherSchedulePage />
                      </PrivateRoute>
                    }
                  />
                </Route>

                <Route
                  path="/plan/edytuj"
                  element={
                    <PrivateRoute>
                      <ModifyTimeslotsPage />
                    </PrivateRoute>
                  }
                />

                <Route path="/zajecia">
                  <Route path="" element={<ListOfTeachersClassesPage />} />
                  <Route
                    path="dodaj"
                    element={
                      <PrivateRoute>
                        <CreateClassesPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="edytuj"
                    element={
                      <PrivateRoute>
                        <EditClassesPage />
                      </PrivateRoute>
                    }
                  />
                </Route>

                <Route
                  path="/otrzymane-zapytania"
                  element={
                    <PrivateRoute>
                      <ReceivedQuestionsAboutClassesPage />
                    </PrivateRoute>
                  }
                />
              </Route>

              {/* Only Student allowed */}
              <Route element={<StudentAllowed />}>
                <Route path="/profil-ucznia">
                  <Route path="" element={<StudentProfilePage />} />
                  <Route path="harmonogram" element={<StudentSchedulePage />} />
                  <Route
                    path="historia-zakupow"
                    element={<PurchaseHistoryPage />}
                  />
                  <Route path="dodane-opinie" element={<AddedOpinionsPage />} />
                </Route>

                <Route path="/zajecia">
                  <Route
                    path=":classesId/kup"
                    element={
                      <PrivateRoute>
                        <BuyClassesPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path=":classesId/zapytaj"
                    element={
                      <PrivateRoute>
                        <AskAboutClassesPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path=":classesId/zakup-po-zapytaniu"
                    element={<BuyClassesPageAfterAsk />}
                  />
                </Route>

                <Route
                  path="/wyslane-zapytania"
                  element={
                    <PrivateRoute>
                      <SendedQuestionsAboutClassesPage />
                    </PrivateRoute>
                  }
                />
              </Route>

              <Route path="/profil">
                <Route
                  path="edytuj"
                  element={
                    <PrivateRoute>
                      <EditBaseProfile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="zmien-haslo"
                  element={
                    <PrivateRoute>
                      <ChangePasswordPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="edytuj-dodatkowe"
                  element={
                    <PrivateRoute>
                      <EditMoreInfosPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="edytuj-avatar"
                  element={
                    <PrivateRoute>
                      <ChangeAvatarPage />
                    </PrivateRoute>
                  }
                />
              </Route>

              <Route
                path="/skrzynka-odbiorcza"
                element={
                  <PrivateRoute>
                    <InboxPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/moje-pokoje"
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
              <Route path="/szukaj-zajec">
                <Route path="" element={<SearchClassesPage />} />

                <Route
                  path="jezyk/:languageSlug"
                  element={<SearchClassesPage />}
                />
                <Route
                  path="miasto/:citySlug"
                  element={<SearchClassesPage />}
                />
                <Route
                  path="tekst/:searchText"
                  element={<SearchClassesPage />}
                />
                <Route
                  path="miejsce-zajec/:onlineSlug"
                  element={<SearchClassesPage />}
                />
              </Route>

              <Route path="/zajecia/:classesId" element={<ClassesPage />} />

              <Route path="/nauczyciel/:teacherId" element={<TeacherPage />} />
              <Route path="/student/:studentId" element={<StudentPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </div>
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
          {!location.pathname.startsWith('/pokoj') && <Footer />}
        </NotificationContextProvider>
      </AuthProvider>
    </div>
  )
}

export default App
