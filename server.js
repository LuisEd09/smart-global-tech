require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Simple mail transport using SMTP credentials from .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/submit-form', async (req, res) => {
  const { nombre, email, servicio, mensaje, company, phone } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ success: false, message: 'Faltan campos requeridos.' });
  }

  const subject = `Nuevo contacto: ${nombre} - ${servicio || 'Interés'}`;
  const textBody = [
    `Nombre: ${nombre}`,
    `Email: ${email}`,
    `Empresa: ${company || '-'}`,
    `Teléfono: ${phone || '-'}`,
    `Servicio: ${servicio || '-'}`,
    '',
    'Mensaje:',
    mensaje,
  ].join('\n');

  try {
    await transporter.sendMail({
      from: `Smart Global Technologies <${process.env.MAIL_FROM || process.env.SMTP_USER}>`,
      to: 'sistemas1@clbajio.com',
      subject,
      text: textBody,
    });

    return res.status(200).json({ success: true, message: 'Mensaje enviado correctamente.' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    return res.status(500).json({ success: false, message: 'No se pudo enviar el mensaje. Intenta más tarde.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
