const discord = require("discord.js");
const { GoogleGenerativeAI }= require("@google/generative-ai");


const MODEL = "gemini-pro";
const API_KEY = process.env.API_KEY ?? "";
const BOT_TOKEN = process.env.BOT_TOKEN?? "";
const CHANNEL_IDS = [ 
   process.env.CHANNEL_ID ?? "1286825497304502354",//channel-1
  "1286843570484936735"//channel-2
];

const ai = new GoogleGenerativeAI(API_KEY);
const model = ai.getGenerativeModel({model : MODEL});

const client = new discord.Client({
   intents: Object.keys(discord.GatewayIntentBits),
});


client.on("ready", () => {
    console.log("Chat Bot is ready!");
});

client.login(BOT_TOKEN);


client.on("messageCreate", async (message) => {
    try {
        if (message.author.bot) return;

        // Cek apakah channel ID ada dalam array CHANNEL_IDS
        if (!CHANNEL_IDS.includes(message.channel.id)) return;

        const { response } = await model.generateContent(message.cleanContent);

        await message.reply({
            content: response.text(),
        });

    } catch (e) {
        console.log(e);
    }
});


// Multi Channel Array -  dalam event message
client.on('message', async (msg) => {
    if (msg.content === 'ping') {
        // Kirim pesan ke setiap channel dalam array
        for (const channelId of CHANNEL_IDS) {
            const channel = client.channels.cache.get(channelId);
            if (channel) {
                await channel.send('pong');
            }
        }
    }
});


// Kode Web Server Sederhana
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Chat Bot is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});