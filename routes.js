const WhatsappController = require('./controllers/WhatsappController');
const customRouter = require('./CustomRouter');

// Tambahkan rute untuk pesan dengan format 'menu'
customRouter.get('menu', WhatsappController.sendMenu);

customRouter.get('chatgpt', WhatsappController.chatgpt);

// Tambahkan rute untuk pesan dengan format 'p'
customRouter.get('p', WhatsappController.ping);

// Tambahkan rute untuk pesan dengan format 'syg'
customRouter.get('syg', WhatsappController.Syg);

// Tambahkan rute untuk pesan dengan format 'stiker'
customRouter.get('stiker', WhatsappController.sendSticker);

customRouter.get('stikerurl', WhatsappController.stickerUrl);

customRouter.get('kick', WhatsappController.kickFromGroup);

customRouter.get('animerandom1', WhatsappController.sendRandomAnime1);

customRouter.get('animerandom2', WhatsappController.sendRandomAnime2);

customRouter.get('animerandom3', WhatsappController.sendRandomAnime3);

customRouter.get('animerandom4', WhatsappController.sendRandomAnime4);

customRouter.get('animegif', WhatsappController.sendAnimeGif);

customRouter.get('asupan', WhatsappController.sendRandomAsupan);

customRouter.get('asupanlist', WhatsappController.viewAsupan);


module.exports = {
  customRouter: customRouter
};
