import React, { useState } from 'react';
import Navbar from '../components/Navbar';

import authBG from '../assets/images/bg_loginreg.png';
import messageBTN from '../assets/images/sendmessage.png';

export default function ContactPage({ user }) {
	const [form, setForm] = useState({ email: '', message: '' });
	const [status, setStatus] = useState('');

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setStatus('Sending...');

		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			});

			if (res.ok) {
				setStatus('Message sent successfully!');
				setForm({ email: '', message: '' });
			} else {
				setStatus('Failed to send. Try again.');
			}
		} catch (err) {
			console.error(err);
			setStatus('Something went wrong.');
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
			<Navbar user={user} />

			<div className="auth-grid">
				{/* Left side */}
				<div className="auth-col left">
					<h1>Need help or have a question?</h1>
				</div>

				{/* Center panel */}
				<div className="auth-col center">
					<div className="auth-panel">
						<h2>Contact Us</h2>
						<form onSubmit={handleSubmit}>
							<input
								type="email"
								name="email"
								placeholder="Your email"
								value={form.email}
								onChange={handleChange}
								required
							/>
							<textarea
								name="message"
								placeholder="Your message"
								value={form.message}
								onChange={handleChange}
								required
								rows="5"
							/>
							<button type="submit">
								<img
									src={messageBTN}
									alt="Submit"
								/>
							</button>
							<p>{status}</p>
						</form>
					</div>
				</div>

				{/* Right side */}
				<div className="auth-col right">
					<h1>We’ll get back to you shortly ✉️</h1>
				</div>
			</div>
		</div>
	);
}
