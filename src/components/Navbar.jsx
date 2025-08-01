import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

import logo from '../assets/images/logo.png';
import name from '../assets/images/name.png';
import loginBtn from '../assets/images/login.png';
import logoutBtn from '../assets/images/logout.png';

export default function Navbar({ user }) {
    const location = useLocation();
    const navigate = useNavigate();
    const isAuthPage = location.pathname === '/auth';

    const handleLogout = async (e) => {
        e.preventDefault();
        await auth.signOut();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <img src={logo} alt="Logo" className="logo" />
                <Link to={user ? '/home' : '/'}>
                    <img src={name} alt="App Name" className="name" />
                </Link>
            </div>
            <div className="navbar-right">
                <Link to={user ? '/user-management' : '/'}>{user ? 'Dashboard' : ' '}</Link>
                <Link to="/customer-support">{user ? 'Support' : 'Contact Us'}</Link>
                {user ? (
                    <Link to="/" onClick={handleLogout}>
                        <img src={logoutBtn} alt="Logout" className="btn-img" />
                    </Link>
                ) : (
                    <Link to="/auth">
                        <img src={loginBtn} alt="Login" className={`btn-img ${isAuthPage ? 'active' : ''}`} />
                    </Link>
                )}
            </div>
        </nav>
    );
}