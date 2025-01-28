const fs = require("fs");
const path = require("path");

// Functie om de JSON te genereren
const generateJson = (folderPath) => {
  const files = fs.readdirSync(folderPath);

  const jsonArray = files.map((file) => {
    const ext = path.extname(file).toLowerCase();
    const baseName = path.basename(file, ext);

    // Bepaal type op basis van extensie
    const type = [".mp4", ".mov"].includes(ext) ? "video" : "img";

    return {
      Theme: baseName.split("_")[0], // Thema uit de bestandsnaam
      Author: "Teije",
      Date: "2024",
      url: `submissions/${file}`,
      type: type,
      duration: 8,
    };
  });

  return jsonArray;
};

// Haal directoryPath op uit command line argumenten
const directoryPath = process.argv[2];

if (!directoryPath) {
  console.error("Gebruik: node script.js <directoryPath>");
  process.exit(1);
}

// JSON genereren en opslaan
const jsonResult = generateJson(directoryPath);
fs.writeFileSync("output.json", JSON.stringify(jsonResult, null, 2), "utf-8");

console.log("JSON gegenereerd en opgeslagen in output.json");
