import Navbar from '../components/Navbar';

import { Link } from 'react-router-dom';

import joinBtn from '../assets/images/join.png';
import landingBG from '../assets/images/bg_landing.png';
import illustration from '../assets/images/illustration.png';

export default function LandingPage({ user }) {
    return (
        <div
            className="page"
            style={{
                backgroundImage: `url(${landingBG})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
        >
            <Navbar user={user} />
            <main className="landing-container">
                <div className="landing-left">
                    <h1 className="landing-title">Make your business<br /> planning easier!</h1>
                    <p className="landing-description">
                        Stratify is a robust business transaction tracker designed to give you a comprehensive overview of your company's financial health. It simplifies the complexities of business finances, helping you manage everything from daily expenses to in-depth departmental spending. With Stratify, you'll gain clarity on your cash flow and empower better decision-making for your business.
                    </p>
                    <Link to="/auth">
                        <img src={joinBtn} alt="Register Now" className="join-btn" />
                    </Link>
                </div>
                <div className="landing-right">
                    <img src={illustration} alt="Team Illustration" className="team-illustration" />
                </div>
            </main>
        </div>
    );
}
