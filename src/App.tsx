import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { StarterGuide } from './pages/StarterGuide';
import { Services } from './pages/Services';
import { BookHousing } from './pages/BookHousing';
import { BookTranslator } from './pages/BookTranslator';
import { RequestService } from './pages/RequestService';
import { Profile } from './pages/Profile';
import { Subscribe } from './pages/Subscribe';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ServiceProviderDashboard } from './pages/serviceProvider/Dashboard';
import { ServiceProviderServices } from './pages/serviceProvider/Services';
import { ProviderLayout } from './pages/serviceProvider/ProviderLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminServiceProviders } from './pages/admin/ServiceProviders';
import { AdminProviderDetails } from './pages/admin/ProviderDetails';
import { AdminServices } from './pages/admin/Services';
import { AdminRequests } from './pages/admin/Requests';
import { AdminTranslators } from './pages/admin/AdminTranslators';
import { AdminStarterGuide } from './pages/admin/AdminStarterGuide';
import { RequireAdmin } from './components/RequireAdmin';
import { AdminLayout } from './pages/admin/AdminLayout';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guide" element={<StarterGuide />} />
            <Route path="/services" element={<Services />} />
            <Route path="/request" element={<RequestService />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Service provider area */}
            <Route path="/provider" element={<ProviderLayout />}>
              <Route index element={<ServiceProviderDashboard />} />
              <Route path="dashboard" element={<Navigate to="/provider" replace />} />
              <Route path="services" element={<ServiceProviderServices />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route path="/book-housing" element={<BookHousing />} />
            <Route path="/book-translator" element={<BookTranslator />} />

            {/* Admin area (requires backend ADMIN login) */}
            <Route element={<RequireAdmin />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="providers" element={<AdminServiceProviders />} />
                <Route path="providers/:providerId" element={<AdminProviderDetails />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="requests" element={<AdminRequests />} />
                <Route path="translators" element={<AdminTranslators />} />
                <Route path="starter-guide" element={<AdminStarterGuide />} />
              </Route>
            </Route>
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
