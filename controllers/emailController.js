const nodemailer = require('nodemailer');

const sendContactEmail = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Užpildykite visus laukus' });
    }

    try {
        // Transporter pagal ENV (saugiau nei hardcodinti)
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER, // pvz. nordauta@gmail.com
                pass: process.env.SMTP_PASS  // App Password iš Google
            }
        });

        const mailOptions = {
            from: `"Nordauta" <${process.env.SMTP_USER}>`, // turi sutapti su prisijungimo user
            to: process.env.MAIL_TO || process.env.SMTP_USER, // gavėjas (tavo el. paštas)
            subject: `Nauja žinutė iš ${name}`,
            text: `
        Vardas: ${name}
        El. paštas: ${email}

        ${message}
      `,
            replyTo: email // kad atsakant atsakytų klientui
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Žinutė išsiųsta sėkmingai!' });
    } catch (error) {
        console.error('Klaida siunčiant el. laišką:', error);
        res.status(500).json({ message: 'Nepavyko išsiųsti žinutės' });
    }
};

module.exports = { sendContactEmail };
