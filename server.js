require('dotenv').config();
const express = require('express');
const cors = require('cors');
const xmlrpc = require('xmlrpc');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configuración de Odoo
const ODOO_URL = 'http://164.90.159.194:8069';
const ODOO_DB = 'sgt_crm';
const ODOO_USER = 'sistemas1@clbajio.com';
const ODOO_PASSWORD = process.env.ODOO_PASSWORD; // Asegúrate de ponerlo en tu .env

const clientCommon = xmlrpc.createClient({ url: `${ODOO_URL}/xmlrpc/2/common` });
const clientObject = xmlrpc.createClient({ url: `${ODOO_URL}/xmlrpc/2/object` });

app.post('/submit-form', (req, res) => {
    const { nombre, email, servicio, mensaje, company, phone } = req.body;

    // Autenticación
    clientCommon.methodCall('authenticate', [ODOO_DB, ODOO_USER, ODOO_PASSWORD, {}], (err, uid) => {
        if (err || !uid) {
            console.error('Error al autenticar en Odoo:', err);
            return res.status(500).json({ success: false, message: 'Error de autenticación con Odoo' });
        }

        // Datos del lead
        const data = {
        name: `${nombre} - ${servicio}`, // Esto es lo que aparece como "nombre del lead"
        partner_name: empresa,
        email_from: email,
        phone: telefono,
        contact_name: nombre,
        description: `
            Servicio de interés: ${servicio}
            Mensaje: ${mensaje}
        `
        };


        // Crear lead
        clientObject.methodCall('execute_kw', [
            ODOO_DB, uid, ODOO_PASSWORD,
            'crm.lead', 'create',
            [leadData]
        ], (err2, leadId) => {
            if (err2) {
                console.error('Error al crear lead:', err2);
                return res.status(500).json({ success: false, message: 'Error al crear lead en Odoo' });
            }

            res.status(200).json({ success: true, message: 'Lead creado correctamente', leadId });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
