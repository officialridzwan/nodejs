class ConversationManager {
    constructor() {
      this.conversations = {};
    }
  
    start(userId, handler) {
      this.conversations[userId] = handler;
    }
  
    end(userId) {
      delete this.conversations[userId];
    }
  
    handleIncoming(userId, message, socket, chat) {
      const conversation = this.conversations[userId];
      if (conversation) {
        conversation(message, socket, chat);
        return true;
      }
      return false;
    }
  }
  
  module.exports = ConversationManager;
  