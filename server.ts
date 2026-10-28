import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'registrations.json');

// Helper to read registrations
function getRegistrations() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading registrations:', e);
  }
  return [];
}

// Helper to save registrations
function saveRegistrations(regs: any[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(regs, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving registrations:', e);
  }
}

// API Routes
app.get('/api/registrations', (req, res) => {
  const regs = getRegistrations();
  res.json(regs);
});

app.post('/api/registrations', (req, res) => {
  try {
    const {
      fullName,
      whatsapp,
      email,
      domicile,
      status,
      fields,
      goal,
      paymentMethod
    } = req.body;

    if (!fullName || !status || !fields || fields.length === 0) {
      return res.status(400).json({ error: 'Data pendaftaran tidak lengkap.' });
    }

    const regs = getRegistrations();
    const newReg = {
      id: 'VAIBE-' + Math.floor(100000 + Math.random() * 900000),
      fullName,
      whatsapp: whatsapp || '-',
      email: email || '',
      domicile: domicile || 'Kendari',
      status,
      fields,
      goal: goal || '',
      paymentMethod: paymentMethod || 'Transfer Bank (BRI/BSI/Mandiri) / QRIS',
      paymentStatus: 'Menunggu Pembayaran',
      membershipStatus: 'Pending',
      nominal: 250000,
      createdAt: new Date().toISOString()
    };

    regs.unshift(newReg);
    saveRegistrations(regs);

    res.status(201).json({
      success: true,
      message: 'Pendaftaran berhasil disimpan. Silakan lakukan pembayaran.',
      registration: newReg
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Admin payment verification
app.post('/api/admin/verify', (req, res) => {
  const { id, paymentStatus, membershipStatus, adminPin } = req.body;
  
  // Simple secure admin pin check
  if (adminPin !== 'vaibekendari2026' && adminPin !== 'divikendari2026' && adminPin !== 'admin123') {
    return res.status(401).json({ error: 'PIN Admin salah.' });
  }

  const regs = getRegistrations();
  const index = regs.findIndex((r: any) => r.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Data pendaftaran tidak ditemukan.' });
  }

  regs[index].paymentStatus = paymentStatus || regs[index].paymentStatus;
  regs[index].membershipStatus = membershipStatus || regs[index].membershipStatus;
  saveRegistrations(regs);

  res.json({ success: true, registration: regs[index] });
});

// Admin login check
app.post('/api/admin/login', (req, res) => {
  const { pin } = req.body;
  if (pin === 'vaibekendari2026' || pin === 'divikendari2026' || pin === 'admin123') {
    res.json({ success: true, token: 'vaibe-admin-token-secure' });
  } else {
    res.status(401).json({ error: 'PIN Admin tidak valid' });
  }
});

// Vite middleware in dev or static in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Digital Vaibe Kendari server running on port ${PORT}`);
  });
}

startServer();
