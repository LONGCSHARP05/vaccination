import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import About from '../pages/About';
// import Home from '../pages/Home';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;