import express, { response } from "express";

const qrcode = require("qrcode-terminal");
const { Client, LocalAuth, RemoteAuth } = require("whatsapp-web.js");

const { MongoStore } = require("wwebjs-mongo");
const mongoose = require("mongoose");

const store = new MongoStore({ mongoose: mongoose });
const uri =
  "mongodb://andrepeixoto:1aZfQP1b0OUhY7lm@ac-6qvwjxy-shard-00-00.ebtfujp.mongodb.net:27017,ac-6qvwjxy-shard-00-01.ebtfujp.mongodb.net:27017,ac-6qvwjxy-shard-00-02.ebtfujp.mongodb.net:27017/?ssl=true&replicaSet=atlas-vk92p0-shard-0&authSource=admin&retryWrites=true&w=majority";

const app = express();
const port = 3000;

app.get("/", (request, response) => {
  return response.send("Server Online 🎉");
});

app.get("/authMongo", (request, response) => {
  mongoose.connect(uri).then(() => {
    console.log("🎲 Conectado ao MongoDB");
    const client = new Client({
      authStrategy: new RemoteAuth({
        store: store,
        clientId: "chefJoice",
        backupSyncIntervalMs: 300000,
      }),
    });
    client.initialize();

    client.on("qr", (qr: any) => {
      console.log("👨‍💻 Gerando QRCode");
      qrcode.generate(qr, { small: true });
    });

    client.on("authenticated", () => {
      console.log("🔐 AUTENTICADO");
    });

    client.on("ready", () => {
      console.log("🤳 PRONTO PARA ENVIAR!");
      response.status(200).end();
    });
  });
});

app.get("/authLocal", (request, response) => {
  console.log("Autenticação WhatsApp 🔐");

  const client = new Client({
    authStrategy: new LocalAuth({ clientId: "chefJoice" }),
  });

  client.on("qr", (qr: any) => {
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    console.log("Client is ready!");
  });

  client.on("authenticated", () => {
    console.log("Autenticado!");
    response.send("Autenticado!");
  });
  client.initialize();
});

app.get("/valida", (request, response) => {
  mongoose.connect(uri).then(() => {
    const client = new Client({
      authStrategy: new RemoteAuth({
        store: store,
        clientId: "chefJoice",
        backupSyncIntervalMs: 300000,
      }),
    });

    client.initialize();

    client.on("remote_session_saved", async () => {
      console.log("VALIDANDO SEÇÃO");
      await store.sessionExists({ session: "RemoteAuth-chefJoice" });
    });
  });
});

app.get("/sender/:num", (request, response) => {
  const num = request.params.num;
  const phoneNumber = `55${num}@c.us`;
  const msg = "Oi ✌ /n/n Aqui é o Robo da Chef Joice";

  const client = new Client({
    authStrategy: new LocalAuth({ clientId: "chefJoice" }),
  });
  client.initialize();

  client.on("authenticated", () => {
    console.log("AUTENTICADO");
  });

  client.on("ready", async () => {
    console.log(`ENVIANDO PARA...${phoneNumber}`);
    client.sendMessage(phoneNumber, msg);
    response.send(`Mensagem: ${msg} enviada para ${num}!`);
  });
});

app.listen(port, () => {
  console.log(`HTTP Server running! ${port}`);
});
