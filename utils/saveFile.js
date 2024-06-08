import { convertArrayToCSV } from "convert-array-to-csv";
import { promises as fs } from "fs";

// Reusable function for saving file
export async function saveFile(filePath, data, format) {
  if (format === "CSV") {
    // Convert array of data into CSV format
    console.log("Converting articles to CSV...");
    const csvFile = convertArrayToCSV(data);

    // Write data to the file
    console.log("Saving articles to CSV file...");
    await fs.writeFile(filePath, csvFile);
    console.log("CSV file has been created successfully!");
  } else if (format === "JSON") {
    // Convert array of data into JSON format
    console.log("Converting articles to JSON...");
    const jsonFile = JSON.stringify(data, null, 2);

    // Write data to the file
    console.log("Saving articles to JSON file...");
    await fs.writeFile(filePath, jsonFile);
    console.log("JSON file has been created successfully!");
  }
}
