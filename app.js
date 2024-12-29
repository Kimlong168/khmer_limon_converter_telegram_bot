import TelegramBot from "node-telegram-bot-api";
import { limon } from "khmer-unicode-converter";
import dotenv from "dotenv"; // Import and configure dotenv
import express from "express";

dotenv.config(); // Load environment variables from .env file

// Access the bot token from the .env file
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const app = express();
const port = process.env.PORT || 3000;

// Function to convert Khmer text to Limon F1
const convertToLimonF1 = (khmerText) => {
  return limon(khmerText);
};

// Handle messages from users
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  //   if user send a text
  const text = msg?.text;

  // if user send a photo, voice or video
  if (!msg.text) {
    bot.sendMessage(
      chatId,
      `*🚫 Unsupported Input 🚫*\n\n_This bot only processes text messages. Please send valid Khmer text to convert it to Limon F1._`,
      { parse_mode: "Markdown" }
    );
    return;
  }

  //   if user send a command
  if (msg.text === "/start") {
    bot.sendMessage(
      msg.chat.id,
      `*👋 Welcome to Khmer Limon F1 Converter Bot!*\n\n_This bot is designed to convert Khmer text to Limon F1. Simply send any Khmer text to get started._\n\n_Powered By: Chann Kimlong_`,
      { parse_mode: "Markdown" }
    );

    return;
  } else if (msg.text === "/help") {
    bot.sendMessage(
      msg.chat.id,
      `*👋 Welcome to Khmer Limon F1 Converter Bot!*\n\n_This bot is designed to convert Khmer text to Limon F1. Simply send any Khmer text to get started._\n\n_For the Limon F1 font, you can download it here: https://khmersoft.net/download-font-limon-khmer-font-for-your-computer/_\n\n_For a tutorial on how to add Khmer text to CapCut, watch this video: https://youtu.be/1N1Dp7JqGVE?si=D9WrtIQbranJ7xp7_\n\n_Powered By: Chann Kimlong_`,
      { parse_mode: "Markdown" }
    );

    return;
  }

  // Convert Khmer text to Limon F1
  const convertedText = convertToLimonF1(text);

  // Check if the converted text is identical to the original (no conversion occurred)
  if (convertedText === text) {
    bot.sendMessage(
      chatId,
      `*🚫 Conversion Failed 🚫*\n\n_It seems like the text cannot be converted to Limon F1. Please make sure you input valid Khmer text._`,
      { parse_mode: "Markdown" }
    );
  } else {
    // Send the converted text back to the user
    bot.sendMessage(
      chatId,
      `*✨ Converted Text (Limon F1) ✨*\n\n\`\`\`\n\n${convertedText}\n\n\`\`\`\n_Powered By: Chann Kimlong_`,
      { parse_mode: "Markdown" }
    );
  }
});

// Handle callback queries
bot.on("callback_query", (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;
  const data = callbackQuery.data;

  // Send a message to the chat with the selected data
  bot.sendMessage(chatId, `You selected: ${data}`);

  // Edit the message to remove the inline keyboard
  bot.editMessageReplyMarkup(
    { inline_keyboard: [] },
    { chat_id: chatId, message_id: messageId }
  );
});

// Handle errors
bot.on("polling_error", (error) => {
  console.log(error);
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
