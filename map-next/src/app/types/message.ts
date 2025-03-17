export interface Message {
    _id: string;
    chatId: string;
    sender: {
      _id: string;
      name: string;
      avatar?: string; // Optional avatar URL
    };
    content: string;
    timestamp: string;
    status?: "sent" | "delivered" | "read"; // Optional message status
  }
  