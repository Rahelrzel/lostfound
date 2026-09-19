import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Reports from './pages/Reports';
import ReportDetails from './pages/ReportDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateReport from './pages/CreateReport';
import EditReport from './pages/EditReport';
import MyReports from './pages/MyReports';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports/:id" element={<ReportDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<CreateReport />} />
        <Route path="/reports/:id/edit" element={<EditReport />} />
        <Route path="/my-reports" element={<MyReports />} />
      </Routes>
    </BrowserRouter>
  );
}