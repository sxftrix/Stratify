const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/contact', async (req, res) => {
	const { email, message } = req.body;

	try {
		let transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'iubtapales@gmail.com',
				pass: 'oguz jexa hbxa xmwi'
			}
		});

		await transporter.sendMail({
			from: email,
			to: 'iubtapales@gmail.com',
			subject: 'New Contact Message',
			text: message
		});

		res.status(200).send({ success: true });
	} catch (err) {
		console.error(err);
		res.status(500).send({ error: 'Email failed to send' });
	}
});

module.exports = router;
