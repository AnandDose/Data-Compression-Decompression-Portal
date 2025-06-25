import React, { useState } from "react";
import axios from "axios";
import {
  Container, Typography, Box, Button,
  Select, MenuItem, InputLabel, FormControl,
  LinearProgress, Paper, Divider
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CompressIcon from "@mui/icons-material/Compress";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useSnackbar } from "notistack";
import { Switch, FormControlLabel } from "@mui/material"
import { IconButton, Tooltip, AppBar, Toolbar } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";  
import Brightness7Icon from "@mui/icons-material/Brightness7"; 


function App({ mode, toggleMode }) {
  const [file, setFile] = useState(null);
  const [algorithm, setAlgorithm] = useState("huffman");
  const [compressedBlob, setCompressedBlob] = useState(null);
  const [decompressedBlob, setDecompressedBlob] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleCompress = async () => {
    if (!file) return enqueueSnackbar("Please upload a file first.", { variant: "warning" });

    if (algorithm === "rle" && file.name.toLowerCase().endsWith(".bin")) {
      const confirmRle = window.confirm("⚠ RLE might increase size for binary files. Continue?");
      if (!confirmRle) return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("algorithm", algorithm);

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/compress", formData, {
        responseType: "json",
      });

      const { buffer, originalSize, compressedSize, timeTaken } = res.data;
      const blob = new Blob([
        Uint8Array.from(atob(buffer), (c) => c.charCodeAt(0)),
      ]);
      setCompressedBlob(blob);
      setStats({
        originalSize,
        compressedSize,
        timeTaken,
        ratio: ((compressedSize / originalSize) * 100).toFixed(2),
      });

      enqueueSnackbar("Compression successful!", { variant: "success" });
    } catch (err) {
      console.error("❌ Compression error:", err);
      enqueueSnackbar("Compression failed: " + err.message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDecompress = async () => {
    if (!file) return enqueueSnackbar("Upload a compressed file first.", { variant: "warning" });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("algorithm", algorithm);

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/decompress", formData, {
        responseType: "blob",
      });
      setDecompressedBlob(res.data);
      enqueueSnackbar("Decompression successful!", { variant: "success" });
    } catch (err) {
      console.error("❌ Decompression error:", err);
      enqueueSnackbar("Decompression failed: " + err.message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!compressedBlob) return;
    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compressed_${file.name}`;
    a.click();
  };

  return (
    <>
    <AppBar position="static" color="transparent" elevation={0}>
  <Toolbar sx={{ display: "flex", justifyContent: "flex-end" }}>
    <Tooltip title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
      <IconButton onClick={toggleMode} color="inherit">
        {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  </Toolbar>
</AppBar>

    <Container maxWidth="md" sx={{ py: 6, display: "flex", justifyContent: "center" }}>
      <Paper elevation={4} sx={{ p: 4, width: "100%", maxWidth: 700 }}>
        <Typography variant="h4" gutterBottom align="center">
          📦 Data Compression Portal
        </Typography>

        <Box display="flex" alignItems="center" gap={2} mt={2}>
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadFileIcon />}
          >
            Upload File
            <input
              hidden
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Button>
          {file && <Typography>{file.name}</Typography>}
        </Box>

        <FormControl fullWidth margin="normal">
          <InputLabel>Compression Algorithm</InputLabel>
          <Select
            value={algorithm}
            label="Compression Algorithm"
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            <MenuItem value="huffman">Huffman Coding</MenuItem>
            <MenuItem value="rle">Run-Length Encoding (RLE)</MenuItem>
            <MenuItem value="lz77">LZ77</MenuItem>
          </Select>
        </FormControl>

        <Box display="flex" gap={2} mt={2} flexWrap="wrap">
          <Button
            variant="contained"
            onClick={handleCompress}
            startIcon={<CompressIcon />}
          >
            Compress
          </Button>
          <Button
            variant="outlined"
            onClick={handleDownload}
            disabled={!compressedBlob}
            startIcon={<DownloadIcon />}
          >
            Download Compressed
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={()=>{(handleDecompress, setStats(null))}}
            startIcon={<RefreshIcon />}
          >
            Decompress
          </Button>
          <Button
            variant="outlined"
            disabled={!decompressedBlob}
            onClick={() => {
              const url = URL.createObjectURL(decompressedBlob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `decompressed_${file.name.replace("compressed_", "")}`;
              a.click();
            }}
            startIcon={<DownloadIcon />}
          >
            Download Decompressed
          </Button>
        </Box>

        {loading && <LinearProgress sx={{ mt: 2 }} />}

        {stats && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6">📊 Compression Stats</Typography>
            <Typography>Original Size: {stats.originalSize} bytes</Typography>
            <Typography>Compressed Size: {stats.compressedSize} bytes</Typography>
            <Typography>Compression Ratio: {stats.ratio}%</Typography>
            <Typography>Time Taken: {stats.timeTaken} ms</Typography>
          </>
        )}
      </Paper>
    </Container>
    </>
  );
}

export default App;
