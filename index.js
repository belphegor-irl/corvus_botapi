const express = require("express");
const ytdl = require("ytdl-core");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/download", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL obrigatória" });
  }

  if (!ytdl.validateURL(url)) {
    return res.status(400).json({ error: "URL inválida do YouTube" });
  }

  try {
    const info = await ytdl.getInfo(url);

    const audioFormat = ytdl.chooseFormat(info.formats, {
      quality: "highestaudio"
    });

    const videoFormat = ytdl.chooseFormat(info.formats, {
      quality: "18" // 360p leve (ideal para WhatsApp)
    });

    return res.json({
      title: info.videoDetails.title,
      duration: info.videoDetails.lengthSeconds,
      thumbnail: info.videoDetails.thumbnails.slice(-1)[0].url,
      audio: audioFormat?.url || null,
      video: videoFormat?.url || null
    });

  } catch (err) {
    console.error("ERRO:", err.message);
    return res.status(500).json({ error: "Erro ao processar vídeo" });
  }
});

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
