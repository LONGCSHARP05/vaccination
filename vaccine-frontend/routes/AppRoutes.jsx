import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import CheckIn from '../pages/CheckIn';
import Reception from '../pages/Reception';
import DashboardOverview from '../pages/Dashboard';
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
        <Route path="/doctor-workspace" element={<DoctorWorkspace />} />
        <Route path="/waiting-list" element={<WaitingList />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
    
  );
};

export default AppRoutes;