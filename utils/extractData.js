// Reusable function to extract data from Hacker News
export async function extractData(
  page,
  numberOfArticles,
  isGettingAdditionalData
) {
  try {
    let initialData = [];
    let additionalData = [];
    let pageNumber = 1;
    let currentId = 1;

    // Loop the process until we have collected the number of articles requested by the user
    while (initialData.length < numberOfArticles) {
      console.log(`Extracting data from page ${pageNumber}`);

      // Locate HTML elements with a classname 'athing'.
      const initialDataLocator = page.locator(".athing");
      const additionalDataLocator = page.locator(".subtext");

      // Extract initial data (tile, url)
      console.log("Extracting articles...");
      const getInitialData = await initialDataLocator.evaluateAll(
        (articles, currentId) => {
          // Utilising the map() method to iterate over the articles array and extract the required information from each article element.
          // This approach allows us to receive an array containing the extracted data.
          return articles.map((article) => {
            // Extracting the <a> element containing the article's Title as innerText and the URL as the href attribute.
            const element = article.querySelector(".title > .titleline > a");

            const title = element?.innerText || "Unknown";
            const url = element?.getAttribute("href") || "N/A";
            const id = currentId++;

            return { id, title, url };
          });
        },
        currentId
      );

      // Update the current ID counter
      currentId += getInitialData.length;

      // Add data extracted from the current page to the initial array
      initialData = initialData.concat(getInitialData);

      // Extract additional data (author, points, time, number of comments) only when user requested it
      if (isGettingAdditionalData) {
        const getAdditionalData = await additionalDataLocator.evaluateAll(
          (articles) => {
            // Utilising the map() method to iterate over the articles array and extract the required information from each article element.
            // This approach allows us to receive an array containing the extracted data.
            return articles.map((article) => {
              const author =
                article.querySelector(".subline > a")?.innerText || "Unknown";
              const points =
                article.querySelector(".score")?.innerText || "N/A";
              const time =
                article.querySelector(".subline > .age > a[href*='item?id=']")
                  ?.innerText || "N/A";

              const numOfComments =
                article.querySelector(".subline > a[href*='item?id=']")
                  ?.innerText || "N/A";

              return { author, points, time, numOfComments };
            });
          }
        );

        // Add data extracted from the current page to the additional array
        additionalData = additionalData.concat(getAdditionalData);
      }

      // Check if we need to load more articles
      if (initialData.length < numberOfArticles) {
        console.log("Loading more articles...");

        const moreButton = await page.locator("a.morelink");
        if ((await moreButton.count()) === 0) {
          console.log("No more articles available.");
          break;
        }

        await moreButton.click();
        pageNumber++;
      } else {
        break;
      }
    }

    return { initialData, additionalData };
  } catch (error) {
    console.error("An error occured while extracting data: ", error);
    return { initialData: [], additionalData: [] };
  }
}
