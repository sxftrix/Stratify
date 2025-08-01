import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

import Navbar from '../components/Navbar';

import authBG from '../assets/images/bg_loginreg.png';
import loginImg from '../assets/images/authlogin.png';
import registerImg from '../assets/images/authregister.png';
export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const navigate = useNavigate();

    const handleAuth = async () => {
        try{
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, pass);
                alert('Logged in!');
                navigate('/home');
            } else {
                await createUserWithEmailAndPassword(auth, email, pass);
                alert('Account created!')
                navigate('/');
            }
        }
        catch (err) {
            alert(err.message);
        }
    };

    return (
        <div
            className="page"
            style={{
                backgroundImage: `url(${authBG})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
        >
            <Navbar user={null} />
            <div className="auth-grid">
                <div className="auth-col left">
                    <h1>Welcome Back!</h1>
                </div>

                <div className="auth-col center">
                    <div className="auth-panel">
                        <h2>{isLogin ? 'Login' : 'Register'}</h2>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                        />
                        <button onClick={handleAuth}>
                            <img
                                src={isLogin ? loginImg : registerImg}
                                alt="Submit"
                            />
                        </button>
                        <p>
                            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                            <span className="link" onClick={() => setIsLogin(!isLogin)}>
                                {isLogin ? 'Register now' : 'Login instead'}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="auth-col right">
                    <h1>
                        {isLogin ? "Let's login to your account" : "Let's get you started"}{' '}
                    </h1>
                </div>
            </div>
        </div>
    );
}
