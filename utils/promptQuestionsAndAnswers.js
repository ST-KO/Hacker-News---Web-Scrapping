import inquirer from "inquirer";

export async function promptQuestionsAndAnswers() {
  try {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "numberOfArticles",
        message: "Enter the number of articles to retrieve (default: 10): ",
        default: 10,
        filter: (input) => parseInt(input) || 10,
      },
      {
        type: "confirm",
        name: "additionalData",
        message:
          "Do you also want to include additional data in the file, such as Author, Points, Time, Number of Comments (default: No): ",
        default: false,
      },
      {
        type: "list",
        name: "outputFormat",
        message: "Which format do you want to save the data in? (default: CSV)",
        choices: ["CSV", "JSON"],
        default: "CSV",
      },
      {
        type: "confirm",
        name: "getEmail",
        message:
          "Would you like to receive an email with the data file attached? (default: No): ",
        default: false,
      },
    ]);
    return answers;
  } catch (error) {
    console.error("An error occured during the prompt: ", error);
  }
}
