const express = require("express");
const ytdl = require("ytdl-core");
const yts = require("yt-search");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/download", async (req, res) => {
  let { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL ou nome obrigatórios" });
  }

  try {

    // 🔎 Se NÃO for link, pesquisar no YouTube
    if (!ytdl.validateURL(url)) {
      const search = await yts(url);
      if (!search.videos.length) {
        return res.status(404).json({ error: "Nenhum resultado encontrado" });
      }
      url = search.videos[0].url; // pega primeiro resultado
    }

    const info = await ytdl.getInfo(url);

    const audioFormat = ytdl.chooseFormat(info.formats, {
      quality: "highestaudio"
    });

    const videoFormat = ytdl.chooseFormat(info.formats, {
      quality: "18"
    });

    res.json({
      title: info.videoDetails.title,
      duration: info.videoDetails.lengthSeconds,
      thumbnail: info.videoDetails.thumbnails.slice(-1)[0].url,
      audio: audioFormat?.url || null,
      video: videoFormat?.url || null
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Erro ao processar mídia" });
  }
});

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
