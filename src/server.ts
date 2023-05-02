import express from "express";
const fs = require("fs");
const path = require("path");

const venom = require("venom-bot");

const app = express();
const port = 3000;

app.get("/", (request, response) => {
  return response.send("Server Online 🎉");
});

app.get("/venom", (request, response) => {
  venom
    .create({
      session: "joice",
      multidevice: true,
    })
    .then((client: any) => {
      response.send("Pronto para enviar!");
      response.status(200).end();
    })
    .catch((erro: any) => {
      console.log(erro);
      response.send(`Erro ao conectar... + ${erro}`);
      response.status(500).end();
    });
});

app.get("/sender/:num", async (request, response) => {
  const num = request.params.num;
  const phoneNumber = `55${num}@c.us`;
  const msg = "Oi ✌ \nAqui é o Robo da Chef Joice"; // \n line break

  const imageBuffer = fs.readFileSync(path.join(__dirname, "img.jpg"));
  const imagemConvertBase64 = imageBuffer.toString("base64");
  const imageBase64 = `data:image/jpg;base64,${imagemConvertBase64}`;

  venom
    .create({
      session: "joice",
      multidevice: true,
    })
    .then((client: any) => start(client))
    .catch((erro: any) => {
      console.log(erro);
    });

  async function start(client: any) {
    console.log("ENVIANDO MENSAGENS");
    console.log(client.getProfilePicFromServer(phoneNumber));

    await client
      .sendText(phoneNumber, msg)
      .then((result: any) => {
        console.log("Result: ", result); //return object success
        response.send(`Mensagem Enviada: ${phoneNumber}: ${msg}`);
      })
      .catch((erro: any) => {
        console.error("Error when sending: ", erro); //return object error
      });

    await client
      .sendImageFromBase64(phoneNumber, imageBase64, "image")
      .then((result: any) => {
        console.log("Result: ", result); //return object success
        response.status(200).end();
      })
      .catch((erro: any) => {
        console.error("Error when sending: ", erro); //return object error
        response.status(500).end();
      });
  }
});

app.listen(port, () => {
  console.log(`SERVER RUNNING: https://localhost:${port}`);
});
