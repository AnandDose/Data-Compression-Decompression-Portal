# 📦 Data Compression & Decompression Portal

A full-stack web application to compress and decompress text, image, and binary files using popular compression algorithms like **Huffman Coding**, **Run-Length Encoding (RLE)**, and **LZ77**.

---

## ✨ Features

- 🔼 **File Upload:** Upload `.txt`, `.bmp`, `.bin`, and more.
- 🗜️ **Compression Algorithms:**
  - Huffman Coding
  - Run-Length Encoding (RLE)
  - LZ77
- 📉 **Compression Stats:** View original size, compressed size, compression ratio, and time taken.
- 💾 **Download:** Download both compressed and decompressed files.
- 🌗 **Dark Mode:** Toggle between light and dark themes.
- ⚠️ **Smart Alerts:** Warns if an algorithm may increase file size (e.g., RLE on `.bin`).
- ✅ **Binary/Image Support:** Handles binary and image files accurately.
- 📦 **Full Backend Support:** Compression logic processed server-side via Express.

---

## 🚀 Tech Stack

| Frontend                | Backend                | Compression Algorithms          |
|-------------------------|------------------------|---------------------------------|
| React + Vite            | Node.js + Express      | Custom JS Implementations       |
| MUI (Material UI)       | Multer (file upload)   | Huffman, RLE, LZ77              |
| notistack (toasts)      | FS, Path               |                                 |

---

## 📂 Project Structure

```
Data-Compression-Portal/
├── client/         # React frontend
│   ├── src/
│   │   ├── App.jsx # Main UI with logic
│   │   └── ...
│   └── ...
├── server/         # Node.js backend
│   ├── algorithms/ # Huffman, RLE, LZ77 modules
│   │   ├── huffman.js
│   │   ├── rle.js
│   │   └── lz77.js
│   └── server.js   # API routes
└── README.md
```

---

## 🧑‍💻 Getting Started

1. **Clone the Repo**
    ```bash
    git clone https://github.com/<your-username>/data-compression-portal.git
    cd data-compression-portal
    ```

2. **Install Dependencies**

    - **Client**
        ```bash
        cd client
        npm install
        ```

    - **Server**
        ```bash
        cd ../server
        npm install
        ```

3. **Run the Application**

    - **Start the Server**
        ```bash
        # In server/
        npm start
        ```

    - **Start the Client (in a second terminal)**
        ```bash
        # In client/
        npm run dev
        ```

4. **Visit:** [http://localhost:5173](http://localhost:5173)

---

_Built with ❤️ by Anand Dose_
