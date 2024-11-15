import fs from "fs";
import path from "path";

const settingsPath = path.join(__dirname, "../../config/settings.json");
const ownersPath = path.join(__dirname, "../../config/owners.json");

export const loadSettings = () => {
  if (!fs.existsSync(settingsPath)) {
    throw new Error("Settings file not found.");
  }

  return JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
};

export const loadOwners = (): string[] => {
  if (!fs.existsSync(ownersPath)) {
    throw new Error("Owners file not found.");
  }

  return JSON.parse(fs.readFileSync(ownersPath, "utf-8"));
};