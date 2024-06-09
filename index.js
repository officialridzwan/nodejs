require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const Boom = require('@hapi/boom');
const { Server } = require('socket.io');
const QRCode = require('qrcode');
const pino = require('pino');
const { customRouter } = require('./routes');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 8080;

const connectedDevices = {};
const SESSIONS_DIR = path.join(__dirname, 'sessions');

if (!fs.existsSync(SESSIONS_DIR)) {
  fs.mkdirSync(SESSIONS_DIR);
}

// Load existing sessions
fs.readdirSync(SESSIONS_DIR).forEach(async (sessionFile) => {
  const sessionPath = path.join(SESSIONS_DIR, sessionFile);
  const stats = fs.statSync(sessionPath);
  if (stats.size > 1000) {
    await connectWhatsapp(sessionFile.replace(/^session-(.*).json$/, '$1'));
  }
});

async function connectWhatsapp(socketId) {
  const sessionPath = path.join(SESSIONS_DIR, `session-${socketId}.json`);
  const auth = await useMultiFileAuthState(sessionPath);
  const socket = makeWASocket({
    printQRInTerminal: false,
    browser: ["Agung Bot!!", "", ""],
    auth: auth.state,
    logger: pino({ level: "silent" })
  });

  connectedDevices[socketId] = socket;
  
  socket.ev.on("creds.update", auth.saveCreds);
  socket.ev.on("connection.update", async ({ connection, qr }) => {
    if (connection === "open") {
      console.log(`Bot Whatsapp Sudah Siap untuk perangkat dengan ID ${socketId}`);
      sendMessageToClients(socketId, { type: "connected" });
    } else if (connection === "close") {
      console.log(`Koneksi ke WhatsApp terputus untuk perangkat dengan ID ${socketId}`);
      sendMessageToClients(socketId, { type: "disconnected" });
      await connectWhatsapp(socketId);
    }
    
    if (qr) {
      QRCode.toDataURL(qr, function (err, url) {
        if (err) {
          console.error('Failed to generate QR code image:', err);
          sendMessageToClients(socketId, { type: "qr", qrImageUrl: null });
        } else {
          sendMessageToClients(socketId, { type: "qr", qrImageUrl: url });
        }
      });
    }
  });

  socket.ev.on("messages.upsert", async ({ messages, type }) => {
    const chat = messages[0];
    if(chat.key.fromMe) return
    const pesan = (chat.message?.extendedTextMessage?.text ?? chat.message?.ephemeralMessage?.message?.extendedTextMessage.text ?? chat.message?.conversation)?.toLowerCase() || "";
    console.log("Pesan:", pesan);
    
    await customRouter.routeMessage(pesan, socket, chat);
  });
}

function sendMessageToClients(socketId, message) {
  io.to(socketId).emit('message', message);
}

io.on('connection', (socket) => {
  console.log(`Perangkat dengan ID ${socket.id} terhubung`);
  
  socket.on('getQR', () => {
    console.log(`Menerima permintaan QR code dari perangkat dengan ID: ${socket.id}`);
    connectWhatsapp(socket.id);
  });

  socket.on('disconnect', () => {
    console.log(`Perangkat dengan ID ${socket.id} terputus`);
    delete connectedDevices[socket.id];
  });
});

// Mengatur Express untuk menggunakan EJS sebagai templating engine
app.set('view engine', 'ejs');

// Mengatur lokasi file-file view
app.set('views', path.join(__dirname, 'views'));

// Menangani rute '/' untuk memuat generatebot.ejs ke dalam index.ejs
app.get('/', (req, res) => {
    res.render('index', { content: fs.readFileSync(path.resolve(__dirname, 'views', 'generatebot.ejs'), 'utf-8') });
});

// Menangani rute '/' untuk memuat generatebot.ejs ke dalam index.ejs
app.get('/disclaimer', (req, res) => {
    res.render('index', { content: fs.readFileSync(path.resolve(__dirname, 'views', 'disclaimer.ejs'), 'utf-8') });
});

// Menangani rute '/' untuk memuat generatebot.ejs ke dalam index.ejs
app.get('/contactus', (req, res) => {
    res.render('index', { content: fs.readFileSync(path.resolve(__dirname, 'views', 'contactus.ejs'), 'utf-8')});
});

// Menangani rute '/' untuk memuat generatebot.ejs ke dalam index.ejs
app.get('/aboutus', (req, res) => {
    res.render('index', { content: fs.readFileSync(path.resolve(__dirname, 'views', 'aboutus.ejs'), 'utf-8')});
});

// Menangani rute '/' untuk memuat generatebot.ejs ke dalam index.ejs
app.get('/privacy-policy', (req, res) => {
    res.render('index', { content: fs.readFileSync(path.resolve(__dirname, 'views', 'privacy.ejs'), 'utf-8')});
});

// Menangani rute '/' untuk memuat generatebot.ejs ke dalam index.ejs
app.get('/terms-conditions', (req, res) => {
    res.render('index', { content: fs.readFileSync(path.resolve(__dirname, 'views', 'terms.ejs'), 'utf-8')});
});

// Menyajikan file statis dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

server.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
