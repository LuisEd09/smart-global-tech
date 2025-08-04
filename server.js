require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/submit-form', async (req, res) => {
    const { nombre, email, servicio, mensaje, company, phone } = req.body;

    const hubspotData = {
        properties: {
            firstname: nombre,
            email: email,
            phone: phone,
            message: mensaje,
            service: servicio,
            company: company,
            hs_lead_status: 'NEW'
        }
    };
    
    console.log('Datos enviados a HubSpot:', hubspotData);

    try {
        const hubspotResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`
            },
            body: JSON.stringify(hubspotData)
        });

        const responseData = await hubspotResponse.json();

        if (!hubspotResponse.ok) {
            console.error('Error de HubSpot:', responseData);
            return res.status(hubspotResponse.status).json({
                success: false,
                message: responseData.message || 'Error en la API de HubSpot',
                hubspotError: responseData
            });
        }

        res.status(200).json({ success: true, message: 'Formulario enviado con éxito.', hubspotId: responseData.id });
    } catch (error) {
        console.error('Error al procesar el formulario:', error);
        res.status(500).json({ success: false, message: 'Ocurrió un problema. Intenta más tarde.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});