class Node {
  constructor(byte, freq, left = null, right = null) {
    this.byte = byte;
    this.freq = freq;
    this.left = left;
    this.right = right;
  }
}

function buildTree(freqMap) {
  const nodes = Object.entries(freqMap).map(
    ([byte, freq]) => new Node(Number(byte), freq)
  );
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const left = nodes.shift();
    const right = nodes.shift();
    nodes.push(new Node(null, left.freq + right.freq, left, right));
  }
  return nodes[0];
}

function buildCodes(node, prefix = "", codes = {}) {
  if (node.byte !== null) {
    codes[node.byte] = prefix;
    return codes;
  }
  buildCodes(node.left, prefix + "0", codes);
  buildCodes(node.right, prefix + "1", codes);
  return codes;
}

function serializeTree(node, bits = []) {
  if (node.byte !== null) {
    bits.push("1");
    bits.push(node.byte.toString(2).padStart(8, "0"));
  } else {
    bits.push("0");
    serializeTree(node.left, bits);
    serializeTree(node.right, bits);
  }
  return bits;
}

function deserializeTree(bits) {
  let index = 0;
  function helper() {
    if (bits[index++] === "1") {
      const byte = parseInt(bits.slice(index, index + 8).join(""), 2);
      index += 8;
      return new Node(byte, 0);
    } else {
      const left = helper();
      const right = helper();
      return new Node(null, 0, left, right);
    }
  }
  return helper();
}

export function compress(buffer) {
  const freq = {};
  for (const byte of buffer) {
    freq[byte] = (freq[byte] || 0) + 1;
  }

  const tree = buildTree(freq);
  const codes = buildCodes(tree);
  const treeBits = serializeTree(tree).join("");

  let dataBits = "";
  for (const byte of buffer) {
    dataBits += codes[byte];
  }

  const combinedBits = treeBits + dataBits;
  const padded = combinedBits.padEnd(Math.ceil(combinedBits.length / 8) * 8, "0");

  const byteArray = new Uint8Array(padded.length / 8);
  for (let i = 0; i < padded.length; i += 8) {
    byteArray[i / 8] = parseInt(padded.slice(i, i + 8), 2);
  }


  const meta = Buffer.alloc(8);
  meta.writeUInt32BE(treeBits.length, 0);
  meta.writeUInt32BE(dataBits.length, 4);

  return Buffer.concat([meta, Buffer.from(byteArray)]);
}

export function decompress(buffer) {
  const treeBitLen = buffer.readUInt32BE(0);
  const dataBitLen = buffer.readUInt32BE(4);
  const bytes = buffer.slice(8);

  let bitString = "";
  for (const byte of bytes) {
    bitString += byte.toString(2).padStart(8, "0");
  }

  const treeBits = bitString.slice(0, treeBitLen).split("");
  const dataBits = bitString.slice(treeBitLen, treeBitLen + dataBitLen);

  const tree = deserializeTree(treeBits);

  const result = [];
  let node = tree;
  for (const bit of dataBits) {
    node = bit === "0" ? node.left : node.right;
    if (node.byte !== null) {
      result.push(node.byte);
      node = tree;
    }
  }

  return Buffer.from(result);
}
