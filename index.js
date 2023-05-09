const apiUrl = "https://opentdb.com/api_category.php";

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const categories = data.trivia_categories;
        const categoryList = document.getElementById("category-list");
        let buttonCount = 0;

        categories.forEach(category => {
            const categoryButton = document.createElement("button");
            categoryButton.innerHTML = category.name;
            categoryButton.classList.add("topic_button");
            categoryButton.setAttribute("data-id", category.id);
            categoryButton.addEventListener("click", () => {
                // handle button click event here
                console.log(`Clicked category ${category.name} with ID ${category.id}`);
                window.location.href = './quiz.html?id=' + `${category.id}`;
            });

            categoryList.appendChild(categoryButton);
            buttonCount++;

            if (buttonCount % 4 === 1) {
                categoryButton.classList.add("topic_button1");
            } else if (buttonCount % 4 === 2) {
                categoryButton.classList.add("topic_button2");
            } else if (buttonCount % 4 === 3) {
                categoryButton.classList.add("topic_button3");
            } else {
                categoryButton.classList.add("topic_button4");
            }
        });
    })
    .catch(error => console.error(error));