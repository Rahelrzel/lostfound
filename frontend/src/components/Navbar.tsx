import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-green-700 text-white px-6 py-3 flex gap-4">
    <Link to="/" className="font-bold">LOSTLY</Link>
    <Link to="/reports">Reports</Link>
    <Link to="/my-reports">My Reports</Link>
    <Link to="/login" className="ml-auto">Login</Link>
  </nav>
);

export default Navbar;