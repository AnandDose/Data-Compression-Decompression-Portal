const WINDOW_SIZE = 4096;
const LOOKAHEAD_SIZE = 255;

export function compress(buffer) {
  const input = buffer;
  const output = [];

  let i = 0;
  while (i < input.length) {
    let matchLength = 0;
    let matchDistance = 0;
    const startWindow = Math.max(0, i - WINDOW_SIZE);

    for (let j = startWindow; j < i; j++) {
      let length = 0;
      while (
        length < LOOKAHEAD_SIZE &&
        i + length < input.length &&
        input[j + length] === input[i + length]
      ) {
        length++;
      }

      if (length > matchLength) {
        matchLength = length;
        matchDistance = i - j;
      }
    }

    if (matchLength >= 3) {
      output.push(1); 
      output.push((matchDistance >> 8) & 0xff, matchDistance & 0xff);
      output.push(matchLength);
      const nextByte = input[i + matchLength] ?? 0;
      output.push(nextByte);
      i += matchLength + 1;
    } else {
      output.push(0); 
      output.push(input[i]);
      i++;
    }
  }

  return Buffer.concat([Buffer.from([0x00]), Buffer.from(output)]);
}


export function decompress(buffer) {
  const input = buffer[0] === 0x00 ? buffer.slice(1) : buffer;
  const result = [];

  let i = 0;
  while (i < input.length) {
    const flag = input[i++];
    if (flag === 0) {
      result.push(input[i++]); 
    } else if (flag === 1) {
      const dist = (input[i++] << 8) | input[i++];
      const length = input[i++];
      const nextByte = input[i++];
      const start = result.length - dist;
      for (let j = 0; j < length; j++) {
        result.push(result[start + j]);
      }
      result.push(nextByte);
    } else {
      throw new Error("Invalid flag byte");
    }
  }

  return Buffer.from(result);
}
