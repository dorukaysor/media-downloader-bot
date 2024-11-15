import fs from "fs";
import path from "path";
import axios from "axios";
import { loadSettings } from "./configLoader";

export const downloadMedia = async (url: string): Promise<string> => {
  const settings = loadSettings();
  const response = await axios.get(url, { responseType: "stream" });
  const contentType = response.headers["content-type"];

  if (!contentType) {
    throw new Error("Invalid content type.");
  }

  const ext = contentType.split("/")[1];
  if (!settings.supportedFormats.includes(ext)) {
    throw new Error(`Unsupported format: .${ext}`);
  }

  const dir = path.join(__dirname, `../../media`);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `file.${ext}`);
  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(filePath));
    writer.on("error", (err) => reject(err));
  });
};