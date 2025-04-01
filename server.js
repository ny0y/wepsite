const rateLimit = require('express-rate-limit');
const csrf = require('csurf');

// Configure rate limiting
const captchaLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many CAPTCHA verification attempts'
});

// Configure CSRF protection
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// middleware to set CSRF token for views
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// hCaptcha endpoint
app.post('/verify-captcha', captchaLimiter, async (req, res) => {
  const { token } = req.body;

  // Validate token exists
  if (!token) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing token parameter' 
    });
  }

  try {
    const params = new URLSearchParams();
    params.append('secret', process.env.HCAPTCHA_SECRET);
    params.append('response', token);
    params.append('sitekey', process.env.HCAPTCHA_SITEKEY);

    const response = await axios.post(
      'https://hcaptcha.com/siteverify', 
      params.toString(),
      {
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        timeout: 5000
      }
    );

    // Debug logging
    console.log('Verification result:', {
      success: response.data.success,
      hostname: response.data.hostname,
      errors: response.data['error-codes'] || []
    });

    res.json(response.data);

  } catch (error) {
    console.error('Verification failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Verification service unavailable'
    });
  }
});

app.post('/verify-captcha', async (req, res) => {
    const { token } = req.body;
  
    // Validate token exists
    if (!token) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing token parameter' 
      });
    }
  
    try {
      // Prepare form data
      const params = new URLSearchParams();
      params.append('secret', process.env.HCAPTCHA_SECRET);
      params.append('response', token);
      params.append('sitekey', process.env.HCAPTCHA_SITEKEY); // Optional but recommended
  
      // Make request
      const response = await axios.post(
        'https://hcaptcha.com/siteverify', 
        params.toString(),
        {
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          timeout: 5000
        }
      );
  
      // Debug logging
      console.log('Verification result:', {
        success: response.data.success,
        challenge_ts: response.data['challenge_ts'],
        hostname: response.data.hostname,
        credit: response.data.credit || false,
        errors: response.data['error-codes'] || []
      });
  
      // Return response
      res.json(response.data);
  
    } catch (error) {
      console.error('Verification failed:', {
        error: error.response?.data || error.message,
        stack: error.stack
      });
  
      res.status(500).json({ 
        success: false, 
        error: 'Verification service unavailable',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  