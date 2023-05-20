const apiUrl = "https://opentdb.com/api_category.php";

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    const categories = data.trivia_categories;
    const categoryList = document.getElementById("category-list");
    const defaultOption = document.createElement("option");
    defaultOption.text = "Select a category";
    categoryList.add(defaultOption);

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.text = category.name;
      option.value = category.id;
      categoryList.add(option);
    });

    categoryList.addEventListener("change", (event) => {
      const categoryID = event.target.value;
      if (categoryID !=="") {
        createDifficultyButtons(categoryID);
      }
    });
  })
  .catch((error) => console.error(error));

const difficultyLevels = ["Easy", "Medium", "Hard"];

const createDifficultyButtons = (categoryID) => {
  const difficultyButtonsContainer = document.getElementById("difficulty-buttons-container");
  difficultyButtonsContainer.innerHTML = ""; // clear existing buttons
  difficultyLevels.forEach((level) => {
    const button = document.createElement("button");
    button.innerText = level;
    button.classList.add("difficulty-button");
    button.addEventListener("click", () => {
      console.log(`Clicked difficulty level ${level} for category ${categoryID}`);
      window.location.href = `./quiz.html?id=${categoryID}&difficulty=${level.toLowerCase()}`;
      const selectedDifficultyElement = document.getElementById("selected-difficulty");
      selectedDifficultyElement.innerText = `Selected difficulty: ${level}`;
    });
    difficultyButtonsContainer.appendChild(button);
  });
};