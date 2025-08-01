import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import AuthPage from './pages/AuthPage';
import UserMgmtPage from './pages/UserMgmtPage';
import BillTrackerPage from './pages/BillTrackerPage';
import DetailedTransacPage from './pages/DetailedTransacPage';

export default function App() {
    const { user } = useAuth(); 

    return (
        <Routes>
            <Route path="/" element={<LandingPage user={user} />} />
            <Route path="/home" element={<HomePage user={user} />} />
            <Route path="/customer-support" element={<ContactPage user={user} />} />
            <Route path="/auth" element={<AuthPage user={user} />} />
            <Route path="/user-management" element={<UserMgmtPage user={user} />} />
            <Route path="/bill-tracker" element={<BillTrackerPage user={user} />} />
            <Route path="/detailed-transactions" element={<DetailedTransacPage user={user} />} />
        </Routes>
    );
}