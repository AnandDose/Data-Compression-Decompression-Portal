import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { compress as huffmanCompress } from './algorithms/huffman.js';
import { compress as rleCompress } from './algorithms/rle.js';
import { decompress as huffmanDecompress } from "./algorithms/huffman.js";
import { decompress as rleDecompress } from "./algorithms/rle.js";
import { compress as lz77Compress, decompress as lz77Decompress } from "./algorithms/lz77.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
const upload = multer({ dest: 'uploads/' });

app.post("/compress", upload.single("file"), async (req, res) => {
  try {
    const { algorithm } = req.body;
    const fileBuffer = fs.readFileSync(req.file.path);
    const filename = req.file.originalname.toLowerCase();
    const ext = path.extname(filename).replace('.', ''); 


    let compressedBuffer;

    if (algorithm === "huffman") {
      compressedBuffer = huffmanCompress(fileBuffer);
    } else if (algorithm === "rle")  {
      let chunkSize = 1;
      if (["bmp", "png", "jpg", "jpeg"].includes(ext)) {
        chunkSize = 3;
      }
      compressedBuffer = rleCompress(fileBuffer, chunkSize);
    } else if (algorithm === "lz77") {
      compressedBuffer = lz77Compress(fileBuffer);
    } else {
      return res.status(400).json({ error: "Unsupported algorithm" });
    }

    res.json({
      buffer: compressedBuffer.toString("base64"),
      originalSize: fileBuffer.length,
      compressedSize: compressedBuffer.length,
      timeTaken: Date.now(),
    });
  } catch (err) {
    console.error("💥 Compression error:", err);
    res.status(500).json({ error: "Compression failed", details: err.message });
  }
});



app.post("/decompress", upload.single("file"), async (req, res) => {
  try {
    const { algorithm } = req.body;
    const fileBuffer = fs.readFileSync(req.file.path);

    let decompressedBuffer;
    if (algorithm === "huffman") {
      decompressedBuffer = huffmanDecompress(fileBuffer);
    } else if (algorithm === "rle") {
      decompressedBuffer = rleDecompress(fileBuffer);
    } else if (algorithm === "lz77") {
      decompressedBuffer = lz77Decompress(fileBuffer);
    } else {
      return res.status(400).json({ error: "Unsupported algorithm" });
    }

    res.setHeader("Content-Disposition", `attachment; filename="decompressed.txt"`);
    res.send(decompressedBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Decompression failed.");
  }
});


app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
