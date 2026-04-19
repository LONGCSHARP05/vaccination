import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import CheckIn from '../pages/CheckIn';
import Reception from '../pages/Reception';
import DashboardOverview from '../pages/Dashboard';

// Các trang của bạn thêm vào
import PostVaccineTracking from '../pages/PostVaccineTracking';
import WaitingForInjection from '../pages/WaitingForInjection';

// Các trang từ nhánh main
import DoctorWorkspace from '../pages/DoctorWorkspace';
import WaitingList from '../pages/WaitingList';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardOverview />} />
        <Route path="/reception" element={<Reception />} />
        <Route path="/check-in" element={<CheckIn />} />
        
        {/* Các Route của bạn */}
        <Route path="/post-vaccine-tracking" element={<PostVaccineTracking />} />
        <Route path="/waiting-for-injection" element={<WaitingForInjection />} />
        
        {/* Các Route từ nhánh main */}
        <Route path="/bac-si/workspace/:sessionID" element={<DoctorWorkspace />} />
        <Route path="/waiting-list" element={<WaitingList />} />
      </Route>
      
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AppRoutes;
