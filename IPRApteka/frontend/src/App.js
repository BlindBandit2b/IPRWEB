import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import ServicesPage from "./pages/ServicesPage";
import DoctorServices from "./pages/DoctorServices";
import ProfilePage from "./pages/ProfilePage";
import Cart from "./pages/Cart";
import MyAppointments from "./pages/MyAppointment";
import EditProfilePage from "./pages/EditProfilePage";
import DoctorVisitsPage from "./pages/DoctorVisitsPage";
import EditVisitPage from "./pages/EditVisitPage";
import DoctorCategoriesPage from "./pages/DoctorCategories";
import ServicesDetailPage from "./pages/ServicesDetailPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import NewsPage from "./pages/NewsPage";
import DictionaryPage from "./pages/DictionaryPage";
import ContactsPage from "./pages/ContactsPage";
import VacanciesPage from "./pages/VacanciesPage";
import ReviewsPage from "./pages/ReviewsPage";
import PromocodesPage from "./pages/PromocodesPage";
import LabPage from "./pages/LabPage";

const ProtectedRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/auth" replace />;

  if (roleRequired && role !== roleRequired) {
    return <Navigate to={role === "doctor" ? "/doctor/services" : "/services"} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/services" replace />} />

        <Route path="/auth" element={<AuthPage />} />

        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServicesDetailPage />} />

        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/profile/edit" element={
          <ProtectedRoute>
            <EditProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/cart" element={
          <ProtectedRoute roleRequired="client"> {}
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="/appointments" element={
          <ProtectedRoute roleRequired="client">
            <MyAppointments />
          </ProtectedRoute>
        } />

        <Route path="/doctor/services" element={
          <ProtectedRoute roleRequired="doctor">
            <DoctorServices />
          </ProtectedRoute>
        } />
        <Route path="/categories" element={
          <ProtectedRoute roleRequired="doctor">
            <DoctorCategoriesPage />
          </ProtectedRoute>
        } />
        <Route path="/doctor/visits" element={
          <ProtectedRoute roleRequired="doctor">
            <DoctorVisitsPage />
          </ProtectedRoute>
        } />
        <Route path="/doctor/visits/:id/edit" element={
          <ProtectedRoute roleRequired="doctor">
            <EditVisitPage />
          </ProtectedRoute>
        } />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/dictionary" element={<DictionaryPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/vacancies" element={<VacanciesPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/promocodes" element={<PromocodesPage />} />
        <Route path="/lab3" element={<LabPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;