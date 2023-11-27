import internal from "stream";

// convert node stream to base64
export async function streamToBase64(stream: internal.Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk) => {
      chunks.push(chunk);
    });
    stream.on("end", () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer.toString("base64"));
    });
    stream.on("error", (err) => {
      console.log(`Error in streamToBase64`, err);
      reject(err);
    });
  });
}
