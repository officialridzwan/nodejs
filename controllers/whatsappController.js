const { downloadContentFromMessage, MessageType, MessageOptions, Mimetype} = require('@whiskeysockets/baileys');
const { createSticker , StickerTypes} = require ('wa-sticker-formatter')
const axios = require('axios');
const fs = require('fs').promises;

class WhatsappController {
static async sendMenu(socket, chat, message) {
  const imageUrl = 'https://i.ibb.co/S5JMK8G/Picsart-24-04-23-08-31-32-292.jpg';

  const menuLines = [
    '╓──────────────────────────────────╖',
    '║  Ikuti Sosial Media Gw Di Bawah:',
    '║  ► *Tiktok:* tiktok.com/@agung_dev',
    '║  ► *IG:* https://bit.ly/AgungDev_22',
    '║  ► *YT:* https://www.youtube.com/@AgungBotWa',
    '║',
    '║  *Menu Bot By Agung Developer*',
    '║  *==Overal Tools Menu==*',
    '║  ► #stiker',
    '║  ► #stikerurl {urlfoto}',
    '║  ► #chatgpt {keyword}',
    '║  *==Group Menu==*',
    '║  ► Auto Strike Toxic',
    '║  *==Wibu Area==*',
    '║  ► #animerandom1',
    '║  ► #animerandom2',
    '║  ► #animerandom3',
    '║  ► #animerandom4',
    '║  ► #animegif',
    '║  *==Bonus Menu==*',
    '║  ► #asupan',
    '║  ► #asupanlist',
    '║  *ComingSoon*',
    '╙──────────────────────────────────╜'
  ];

  const menuText = menuLines.join('\n');

  await socket.sendMessage(chat.key.remoteJid, { image: { url: imageUrl }, caption: menuText }, { quoted: chat });
}

static async sendRandomAnime1(socket, chat, message) {
    try {
      const response = await axios.get('https://agungdevlop.github.io/url.github.io/animeku.json');
      const animeList = response.data.anime;
      const randomIndex = Math.floor(Math.random() * animeList.length);
      const randomAnimeUrl = animeList[randomIndex];

      await socket.sendMessage(chat.key.remoteJid, { image: { url: randomAnimeUrl }, caption: "Random Anime" }, { quoted: chat });
    } catch (error) {
      console.error('Error fetching random anime:', error);
    }
  }

static async sendRandomAnime2(socket, chat, message) {
  try {
    const response = await axios.get('https://nekos.pro/api/fucking/');
    const { character_name, url } = response.data;

    const caption = `Character Name: ${character_name}\nURL: ${url}`;
    await socket.sendMessage(chat.key.remoteJid, { image: { url: url }, caption: caption }, { quoted: chat });
  } catch (error) {
    console.error('Error fetching and sending random anime:', error);
  }
}

static async sendRandomAnime3(socket, chat, message) {
    try {
      const response = await axios.get('https://api.nekosapi.com/v3/images/random');
      const nekoData = response.data.items[0];
      const imageUrl = nekoData.image_url;
      let caption = `Rating: ${nekoData.rating} \nImageUrl: ${imageUrl}`;

      // Tambahkan informasi nama karakter jika tersedia
      if (nekoData.characters.length > 0) {
        caption += `\nCharacter: ${nekoData.characters[0].name}`;
      }

      // Tambahkan informasi deskripsi karakter jika tersedia
      if (nekoData.characters.length > 0 && nekoData.characters[0].description) {
        caption += `\nDescription: ${nekoData.characters[0].description}`;
      }

      await socket.sendMessage(chat.key.remoteJid, { image: { url: imageUrl }, caption: caption }, { quoted: chat });
    } catch (error) {
      console.error('Error fetching random neko:', error);
    }
  }

static async sendRandomAnime4(socket, chat, message) {
  try {
    const response = await axios.get('https://nekos.pro/api/neko/');
    const { url } = response.data;

    const caption = `Img Url: ${url}`;
    await socket.sendMessage(chat.key.remoteJid, { image: { url: url }, caption: caption }, { quoted: chat });
  } catch (error) {
    console.error('Error fetching and sending random neko:', error);
  }
}


static async sendAnimeGif(socket, chat, message) {
  try {
    const response = await axios.get('https://nekos.best/api/v2/hug');
    const { anime_name, url } = response.data.results[0];

    const caption = `Anime: ${anime_name}`;
    await socket.sendMessage(chat.key.remoteJid, { video: { url: url }, caption: caption, gifPlayback: true }, { quoted: chat });
  } catch (error) {
    console.error('Error fetching and sending anime gif:', error);
  }
}
  
 static async sendRandomAsupan(socket, chat, message) {
    try {
      const response = await axios.get('https://raw.githubusercontent.com/AgungDevlop/Viral/main/Video.json');
      const videos = response.data;

      // Ambil video secara acak
      const randomIndex = Math.floor(Math.random() * videos.length);
      const randomVideo = videos[randomIndex];

      const videoUrl = randomVideo.id;
      const caption = randomVideo.Judul;

      await socket.sendMessage(chat.key.remoteJid, { text: `==== Sedang di proses... ====` }, { quoted: chat });
      await socket.sendMessage(chat.key.remoteJid, { video: { url: videoUrl }, caption: `*Judul:* ${caption}\n\n*VideoUrl:*https://video.apkspace.my.id/${videoUrl}` }, { quoted: chat });
    } catch (error) {
      console.error('Error fetching random asupan:', error);
    }
  }
 
  static async viewAsupan(socket, chat, message) {
    try {
        const response = await axios.get('https://raw.githubusercontent.com/AgungDevlop/Viral/main/Video.json');
        let videos = response.data;

        // Mengacak urutan video menggunakan algoritma Fisher-Yates (shuffle)
        for (let i = videos.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [videos[i], videos[j]] = [videos[j], videos[i]];
        }

        // Mengonversi semua video menjadi teks
        const videoTexts = videos.map(video => `*Judul:* ${video.Judul}\n*URL:* https://video.apkspace.my.id/${video.id}`);

        // Menggabungkan semua teks menjadi satu pesan
        const messageText = videoTexts.join('\n\n');

        await socket.sendMessage(chat.key.remoteJid, { text: messageText }, { quoted: chat });
    } catch (error) {
        console.error('Error fetching and sending random asupan:', error);
        await socket.sendMessage(chat.key.remoteJid, { text: 'Error fetching random asupan' }, { quoted: chat });
    }
}



 static async kickFromGroup(socket, chat, phoneNumber) {
    const isAdmin = chat.key.fromMe === true; // Pengecekan apakah pesan berasal dari admin grup atau bot

    // Menghapus karakter '@' dari nomor telepon
    const cleanedPhoneNumber = phoneNumber.replace('@', '');

    try {
      const groupJid = chat.key.remoteJid;
      
      // Hanya izinkan admin grup atau bot untuk mengeluarkan anggota
      if (isAdmin) {
        const response = await socket.groupParticipantsUpdate(
          groupJid,
          [`${cleanedPhoneNumber}@s.whatsapp.net`], // Nomor yang akan dikeluarkan dari grup
          "remove" // Tindakan untuk menghapus anggota grup
        );
        // Kirim pesan konfirmasi ke grup
        const menuText = `User dengan nomor ${cleanedPhoneNumber} telah dikeluarkan dari grup`;
        await socket.sendMessage(chat.key.remoteJid, { text: menuText }, { quoted: chat });
      } else {
        // Jika pesan bukan dari admin atau bot, kirim pesan balasan bahwa hanya admin yang dapat melakukan tindakan ini
        const replyText = `Maaf, hanya admin atau bot yang dapat melakukan tindakan ini.`;
        await socket.sendMessage(chat.key.remoteJid, { text: replyText }, { quoted: chat });
      }
    } catch (error) {
      const errorText = `Bot harus jadi admin grup dulu`;
        await socket.sendMessage(chat.key.remoteJid, { text: errorText }, { quoted: chat });
    }
  }
  
 static async chatgpt(socket, chat, message) {
    socket.sendMessage(chat.key.remoteJid, { text: `${message}\n\n==== Sedang di proses... ====` }, { quoted: chat });
    try {
      const response = await axios.get(`https://tools.revesery.com/ai/ai.php?query=${message}`+" Jawab Dalam Bahasa Indonesia", {
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.9999.999 Safari/537.36'
        }
      });
      
      if (response.status === 200 && response.data.status === 200) {
        const result = response.data.result;
        socket.sendMessage(chat.key.remoteJid, { text: result }, { quoted: chat });
      } else {
        console.error('Pertanyaan gagal di proses tolong pertanyaan lain');
        socket.sendMessage(chat.key.remoteJid, { text: 'Pertanyaan gagal di proses tolong pertanyaan lain' }, { quoted: chat });
      }
    } catch (error) {
      console.error('Error in chatgpt:', error.message);
      socket.sendMessage(chat.key.remoteJid, { text: 'Error in chatgpt' }, { quoted: chat });
    }
  }
  
 static async stickerUrl(socket, chat, message) {
    try {
    const randomAnimeUrl = message;

    const mediaData = await axios.get(randomAnimeUrl, { responseType: 'arraybuffer' });
    const stickerOption = {
      pack: "WaBot",
      author: "Agung",
      type: StickerTypes.FULL,
      quality: 50
    };
    const generateSticker = await createSticker(mediaData.data, stickerOption);
    await socket.sendMessage(chat.key.remoteJid, { sticker: generateSticker });
  } catch (error) {
    console.error('Error fetching and sending random anime sticker:', error);
  }

}
  
  static async sendSticker(socket, chat, caption) {
    if(chat.message?.imageMessage){
      const getMeida = async (msg) => {
        const MessageType = Object.keys(msg?.message)[0]
        const stream = await downloadContentFromMessage(msg.message[MessageType], MessageType.replace('Message',''))
        let buffer = Buffer.from([])
        for await (const chunk of stream){
          buffer = Buffer.concat([buffer, chunk])
        }

        return buffer
      }

      const mediaData = await getMeida(chat)
      const stickerOption = {
        pack : "WaBot",
        author : "Agung",
        type : StickerTypes.FULL,
        quality : 50
      }
      const generateSticker = await createSticker(mediaData, stickerOption);
      await socket.sendMessage(chat.key.remoteJid, {sticker: generateSticker})
    }
    
  }
}

module.exports = WhatsappController;