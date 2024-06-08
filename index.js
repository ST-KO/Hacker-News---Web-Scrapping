import { chromium } from "playwright";

import { promptQuestionsAndAnswers } from "./utils/promptQuestionsAndAnswers.js";
import { sendEmail } from "./utils/sendEmail.js";
import { saveFile } from "./utils/saveFile.js";
import { extractData } from "./utils/extractData.js";

// Main function to save Hacker News articles
async function saveHackerNewsArticles() {
  try {
    // Ask the user questions to gather input data
    const promptAnswers = await promptQuestionsAndAnswers();
    console.log(promptAnswers);

    // Save user's input on the number of articles to retrieve and whether to include additional data
    let numberOfArticles = promptAnswers.numberOfArticles;
    let isGettingAdditionalData = promptAnswers.additionalData;

    // Launch browser
    console.log("Launching browser...");
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Go to Hacker News
    console.log("Waiting for Hacker News...");
    await page.goto("https://news.ycombinator.com");

    // Extract data from Hacker News using the reusable extractData function
    const { initialData, additionalData } = await extractData(
      page,
      numberOfArticles,
      isGettingAdditionalData
    );

    // Combine the initial data and additional data if requested
    let combinedData;
    if (isGettingAdditionalData) {
      combinedData = initialData
        .map((initialData, index) => ({
          ...initialData,
          ...additionalData[index],
        }))
        .slice(0, numberOfArticles); // Limit the data to the number of articles requested by the user
    } else {
      combinedData = initialData.slice(0, numberOfArticles); // Limit the data to the number of articles requested by the user
    }

    // Create file path to save data file
    const filePath = `top_articles.${promptAnswers.outputFormat.toLowerCase()}`;

    // Save the combined data to a file in the specified format (CSV or JSON) using the reusable saveFile function
    await saveFile(filePath, combinedData, promptAnswers.outputFormat);

    // Send email with attached data file if user requested it
    console.log("Sending the requested data file to your email...");
    if (promptAnswers.getEmail) {
      await sendEmail(filePath);
      console.error("Email has been sent successfully!");
    }

    await browser.close();
  } catch (error) {
    console.error("An error occurred: ", error);
  }
}

(async () => {
  await saveHackerNewsArticles();
})();
