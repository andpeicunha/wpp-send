import express from "express";

const app = express();
const port = 5000;

app.get("/", (request, response) => {
  return response.send("Hello World!");
});

app.get("/wpp", (request, response) => {
  return response.send("WPP");
});

app.listen(port, () => {
  console.log(`HTTP Server running! ${port}`);
});
