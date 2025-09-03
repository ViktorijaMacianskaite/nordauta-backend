const nodemailer = require('nodemailer');

const sendContactEmail = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Užpildykite visus laukus' });
    }

    // Sukurk el. pašto siuntėjo transporterį
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nordauta@gmail.com',       // tavo gmail (reikės specialaus slaptažodžio)
            pass: 'yqzndqnbcszzvghf'               // aplikacijos slaptažodis, ne tavęs gmail slaptažodis
        }
    });

    const mailOptions = {
        from: email,
        to: 'nordauta@gmail.com',         // į ką siunčiame (kontaktų formos el.paštas)
        subject: `Nauja žinutė iš ${name}`,
        text: message,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Žinutė išsiųsta sėkmingai!' });
    } catch (error) {
        console.error('Klaida siunčiant el. laišką:', error);
        res.status(500).json({ message: 'Nepavyko išsiųsti žinutės' });
    }
};

module.exports = { sendContactEmail };
