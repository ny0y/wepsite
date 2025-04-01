const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// hCaptcha Verification Endpoint
app.post('/verify-captcha', async (req, res) => {
    try {
        const { token } = req.body;
        const response = await axios.post('https://hcaptcha.com/siteverify', new URLSearchParams({
            secret: 'ES_1d64ff72d93242ef981c1bea834774e2',
            response: token
       }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Verification failed' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));