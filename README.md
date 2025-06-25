# 📦 Data Compression & Decompression Portal

A full-stack web application to compress and decompress text, image, and binary files using popular compression algorithms like **Huffman Coding**, **Run-Length Encoding (RLE)**, and **LZ77**.

---

## ✨ Features

- 🔼 **File Upload:** Upload any `.txt`, `.bmp`, `.bin`, etc.
- 🗜️ **Compression Algorithms:**
  - Huffman Coding
  - Run-Length Encoding (RLE)
  - LZ77
- 📉 **Compression Stats:** Original size, compressed size, compression ratio, and time taken.
- 💾 **Download:** Download compressed and decompressed files.
- 🌗 **Dark Mode:** Toggle between light and dark themes.
- ⚠️ **Smart Alerts:** Warns users when an algorithm may increase file size (like RLE on `.bin`).
- ✅ **Binary/Image Support:** Accurately handles binary and image file formats.
- 📦 **Full Backend Support:** Compression logic is processed server-side via Express.

---

## 🚀 Tech Stack

| Frontend        | Backend         | Compression Algorithms |
|-----------------|-----------------|-------------------------|
| React + Vite    | Node.js + Express | Custom JS Implementations |
| MUI (Material UI) | Multer (for file upload) | Huffman, RLE, LZ77 |
| notistack (toasts) | FS, Path        |                         |

---

## 📂 Project Structure

Data-Compression-Portal/
├── client/ # React frontend
│ ├── src/
│ │ ├── App.jsx # Main UI with logic
│ │ └── ...
│ └── ...
├── server/ # Node.js backend
│ ├── algorithms/ # Huffman, RLE, LZ77 modules
│ │ ├── huffman.js
│ │ ├── rle.js
│ │ └── lz77.js
│ └── server.js # API routes
└── README.md


---

## 🧑‍💻 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/<your-username>/data-compression-portal.git
cd data-compression-portal

cd client
npm install

cd ../server
npm install

# In server/
npm start

# In client/ (in a second terminal)
npm run dev

Visit: http://localhost:5173







Built with ❤️ by Anand Dose
