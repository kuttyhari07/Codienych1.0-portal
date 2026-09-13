const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const config = require('./config/env');

const registrationRoutes = require('./routes/registrationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Trust proxy for Render / reverse proxies so express-rate-limit gets correct client IP
app.set('trust proxy', 1);

// Security Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// CORS Setup - Allow Vercel, localhost, custom client URLs, and all origins safely
app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    // Allow any .vercel.app deployment or custom domain
    if (
      origin.includes('vercel.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      (config.CLIENT_URL && origin.includes(config.CLIENT_URL.replace(/^https?:\/\//, '')))
    ) {
      return callback(null, true);
    }
    // Fallback: allow request
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200,
}));

// Explicit pre-flight response for all routes
app.options('*', cors());

// Rate Limiter for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
});

app.use('/api', apiLimiter);

// Body Parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve Uploaded Files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/registrations', registrationRoutes);
app.use('/api/admin', adminRoutes);

// Root & Health check endpoints
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    message: 'CODIENYCH 1.0 Backend API Control Center is running smoothly 🚀',
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    event: config.EVENT_NAME,
    type: config.EVENT_TYPE,
    timestamp: new Date(),
  });
});

app.get('/api/test-email-status', async (req, res) => {
  const dns = require('dns');
  const nodemailer = require('nodemailer');
  const { Resend } = require('resend');

  const smtpUser = (process.env.SMTP_USER || config.SMTP_USER || 'codienych@gmail.com').trim();
  const smtpPass = (process.env.SMTP_PASS || config.SMTP_PASS || 'subfywhhtpobafgy').replace(/\s+/g, '').trim();
  const resendApiKey = (process.env.RESEND_API_KEY || config.RESEND_API_KEY || 're_fEHF4sA9_2HFGQmY7kMhXKg42KLjnTdMo').trim();
  const targetEmail = req.query.email || 'codienych@gmail.com';

  const logs = [];

  // 1. Test Resend
  let resendSuccess = false;
  try {
    const resend = new Resend(resendApiKey);
    const rRes = await resend.emails.send({
      from: 'CODIENYCH 1.0 Hackathon <onboarding@resend.dev>',
      to: [targetEmail],
      subject: '⚡ Diagnostic Resend Test',
      html: '<p>Resend Test</p>',
    });
    logs.push({ step: 'Resend API', result: rRes });
    if (rRes && rRes.data && rRes.data.id) resendSuccess = true;
  } catch (rErr) {
    logs.push({ step: 'Resend Error', error: rErr.message });
  }

  // 2. Test Direct SMTP configs
  const smtpResults = [];
  const configs = [
    { name: 'Port 465 SSL host:smtp.gmail.com', host: 'smtp.gmail.com', port: 465, secure: true },
    { name: 'Port 587 TLS host:smtp.gmail.com', host: 'smtp.gmail.com', port: 587, secure: false },
    { name: 'service:gmail', service: 'gmail' },
  ];

  for (const cfg of configs) {
    try {
      const opts = cfg.service 
        ? { service: 'gmail', auth: { user: smtpUser, pass: smtpPass } }
        : { 
            host: cfg.host, 
            port: cfg.port, 
            secure: cfg.secure, 
            auth: { user: smtpUser, pass: smtpPass },
            family: 4,
            connectionTimeout: 5000,
            tls: { rejectUnauthorized: false } 
          };
      
      const transporter = nodemailer.createTransport(opts);
      const info = await transporter.sendMail({
        from: `"CODIENYCH 1.0" <${smtpUser}>`,
        to: targetEmail,
        subject: `⚡ Diagnostic Test - ${cfg.name}`,
        html: '<p>SMTP Test</p>',
      });
      smtpResults.push({ config: cfg.name, success: true, messageId: info.messageId });
    } catch (sErr) {
      smtpResults.push({ config: cfg.name, success: false, error: sErr.message, code: sErr.code });
    }
  }

  return res.status(200).json({
    targetEmail,
    smtpUser,
    smtpPassLength: smtpPass.length,
    resendSuccess,
    smtpResults,
    logs,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'One of your uploaded image files is too large. Please upload files under 15MB each.',
    });
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = config.PORT;

const autoSeedAdmin = async () => {
  try {
    const Admin = require('./models/Admin');
    if (!config.ADMIN_EMAIL || !config.ADMIN_PASSWORD) return;
    const adminExists = await Admin.findOne({ email: config.ADMIN_EMAIL.toLowerCase().trim() });
    if (!adminExists) {
      await Admin.create({
        name: 'CODIENYCH Super Admin',
        email: config.ADMIN_EMAIL.toLowerCase().trim(),
        password: config.ADMIN_PASSWORD,
        role: 'SUPER_ADMIN',
      });
      console.log(`[Auto-Seed] Super Admin created: ${config.ADMIN_EMAIL}`);
    }
  } catch (err) {
    console.warn(`[Auto-Seed Info] ${err.message}`);
  }
};

const startServer = async () => {
  await connectDB();
  await autoSeedAdmin();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`==================================================`);
    console.log(`🚀 CODIENYCH 1.0 Control Center Server Active`);
    console.log(`📡 Port: ${PORT}`);
    console.log(`🌍 Environment: ${config.NODE_ENV}`);
    console.log(`==================================================`);
  });
};

startServer();
