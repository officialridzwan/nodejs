class CustomRouter {
  constructor() {
      this.routes = {};
  this.kataKasar = [
    // Kata-kata kasar
    'anjing', 'bangsat', 'babi', 'kontol', 'memek', 'asu', 'tolol', 'goblok', 'idiot', 'setan',
    'jancok', 'jembut', 'taik', 'tai', 'ngentot', 'bajingan', 'bego', 'bodoh', 'banci', 'mampus',
    'ngok', 'bangke', 'keparat', 'pepek', 'cibai', 'sial', 'jahat',
    // Plesetan kata-kata kasar
    '4nj1ng', 'b4ngs4t', 'b4b1', 'k0nt0l', 'm3m3k', '4s0', 't0l0l', 'g0bl0k', '1d10t', 's3t4n',
    'j4nc0k', 'j3mbut', 't41k', 't41', 'ng3nt0t', 'b4j1ng4n', 'b3g0', 'b0d0h', 'b4nc1', 'm4mpu$',
    'ng0k', 'b4ngk3', 'k3p4r4t', 'p3p3k', 'c1b41', 's14l', 'j4h4t',
    // Kata kasar dengan karakter yang diganti
    'njing', 'b*ngsat', 'b*b*', 'k*nt*l', 'm*mek', 'a*u', 't*l*l', 'g*bl*k', 'id**t', 's*t*n',
    'j*nc*k', 'j*mb*t', 't**k', 't**', 'ng*nt*t', 'b*j*ng*n', 'b*g*', 'b*d*h', 'b*nc*', 'm*mp*s',
    'ng*k', 'b*ngk*', 'k*p*r*t', 'p*p*k', 'c*b*i', 's**l', 'j*h*t',
  ];
  
    }
  
    get(path, handler) {
      this.routes[path] = handler;
    }
  
   async routeMessage(message, socket, chat) {
    if (!chat.message) {
      console.log('Received message is empty or not recognized');
      return;
    }
    
  
    if (chat.message.imageMessage) {
      const caption = chat.message.imageMessage.caption;
      if (caption && caption.startsWith('#')) {
        const command = caption.substring(1).toLowerCase(); // Hilangkan '#' dari caption
        const handler = this.routes[command];
        if (handler) {
          handler(socket, chat, caption);
        } else {
          console.log(`Command '${command}' not found`);
        }
      }
    } else {
        const words = message.split(' ');
        const firstWord = words.shift().toLowerCase();
        if (firstWord.startsWith('#')) {
          const command = firstWord.substring(1); // Hilangkan '#' dari awal pesan
          const handler = this.routes[command];
          if (handler) {
            handler(socket, chat, words.join(' ')); // Kirim pesan tanpa '#'
          } else {
            console.log(`Command '${command}' not found`);
          }
        } else {
          // Cek jika pesan mengandung kata-kata kasar
          if (this.containsKataKasar(message)) {
            // Lakukan kick dari grup
            await this.kickFromGroup(socket, chat);
            return;
          }
  
          // Tidak ada '#' pada pesan, tetapi mengandung kata-kata kasar, maka kirim ke default handler
          const handler = this.routes['default']; // Tambahkan default handler jika tidak ada '#'
          if (handler) {
            handler(socket, chat, message);
          } else {
            console.log('Default handler not found');
          }
        }
      }
  }
  
    
  
    containsKataKasar(message) {
      const lowercasedMessage = message.toLowerCase();
      return this.kataKasar.some(kata => lowercasedMessage.includes(kata));
    }
  
    async kickFromGroup(socket, chat) {
      try {
        const groupJid = chat.key.remoteJid;
        const participantJid = chat.key.participant;
        const nama = chat.pushName;
        const response = await socket.groupParticipantsUpdate(
          groupJid,
          [participantJid],
          "remove"
        );
        const menuText = `${nama} Sangat meresahkan jadi saya kick aja hehehe`;
        socket.sendMessage(chat.key.remoteJid, { text: menuText }, { quoted: chat });
      } catch (error) {
        console.error('Error kicking participant:', error);
      }
    }
  }
  
  module.exports = new CustomRouter();
  
  