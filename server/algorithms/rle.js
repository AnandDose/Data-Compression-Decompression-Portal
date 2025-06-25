export function compress(buffer, chunkSize = 1) {
  const result = [];

  let i = 0;
  while (i < buffer.length) {
    const chunk = buffer.slice(i, i + chunkSize);
    let count = 1;

    while (
      i + chunkSize * (count + 1) <= buffer.length &&
      buffer.slice(i, i + chunkSize).equals(
        buffer.slice(i + chunkSize * count, i + chunkSize * (count + 1))
      ) &&
      count < 255
    ) {
      count++;
    }

    if (count >= 3) {
  result.push(0x01);
  result.push(...chunk, count);
  i += chunkSize * count;
} else {
  for (let j = 0; j < count; j++) {
    result.push(0x00);
    result.push(...chunk);
    i += chunkSize;
  }
}

  }

  return Buffer.concat([
    Buffer.from([chunkSize]),
    Buffer.from(result)
  ]);
}


export function decompress(buffer) {
  const chunkSize = buffer[0]; 
  const result = [];

  let i = 1;
  while (i < buffer.length) {
    const flag = buffer[i++];
    const chunk = buffer.slice(i, i + chunkSize);

    if (flag === 0x01) {
      const count = buffer[i + chunkSize];
      for (let j = 0; j < count; j++) result.push(...chunk);
      i += chunkSize + 1;
    } else {
      result.push(...chunk);
      i += chunkSize;
    }
  }

  return Buffer.from(result);
}
