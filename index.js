const express = require("express");
const ytdl = require("ytdl-core");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/download", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL obrigatória" });

  try {
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: "highestaudio" });
    return res.json({ title: info.videoDetails.title, link: format.url });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao processar vídeo" });
  }
});

app.listen(PORT, () => {
  console.log(`API rodando → http://localhost:${PORT}`);
});
