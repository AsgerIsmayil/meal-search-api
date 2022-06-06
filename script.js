const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const mealDetails = document.querySelector(".meal-details");
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const searchControl = document.querySelector(".search-control");
const mealSearch = document.querySelector('.meal-search');
const mealResult = document.querySelector('.meal-result');
const mealItem = document.querySelector('.meal-item')
const body = document.querySelector('body');

// event listeners
searchBtn.addEventListener('click', getMealList);
searchControl.addEventListener('keypress', getMealListEnter);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
    body.style.overflowY = "scroll"
});

function detailsClose() {
    document.addEventListener('contextmenu', (evt) => {
        evt.preventDefault();
        mealDetailsContent.parentElement.classList.remove('showRecipe');
        body.style.overflowY = "scroll"
    });
}

function pageUp() {
    document.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode == 13) {
            window.scrollTo(0, 0);
        }
    };
}

function stopPageUp() {
    document.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode == 13) {
            evt.preventDefault();
        }
    };
}


// get meal list that matches with the ingredients
function getMealList() {

    let searchInputTxt = document.getElementById('search-input').value.trim();
    if (searchControl.value != "") {
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
            .then(response => response.json())
            .then(data => {
                let html = "";
                if (data.meals) {
                    data.meals.forEach(meal => {
                        html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recipe-btn">Get Recipe</a>
                        </div>
                    </div>
                `;
                    });
                    mealList.classList.remove('notFound');
                } else {
                    html = "Sorry, we didn't find any meal!";
                    mealList.classList.add('notFound');
                }

                mealList.innerHTML = html;

            });
    }
}
document.getElementById('scroll-up').style.display = 'none'
function getMealListEnter(e) {
    if (e.key === 'Enter') {
        getMealList()
    }
}

// get recipe of the meal
function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => mealRecipeModal(data.meals));
    }

}


// create a modal
function mealRecipeModal(meal) {
    console.log(meal);
    meal = meal[0];
    let html = `
        <div class="right-click">right click to exit</div>
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
            
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
    body.style.overflowY = "hidden";
    document.getElementById('scroll-up').style.display = 'none'
    detailsClose();
}

pageUp()

function scrollUp() {
    const scrollUp = document.getElementById('scroll-up');
    // When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if (this.scrollY >= 350) {
        scrollUp.classList.add('show-scroll');
        scrollUp.style.display = "flex"
    } else {
        scrollUp.classList.remove('show-scroll');
        scrollUp.style.display = 'none'
    }
}
window.addEventListener('scroll', scrollUp)

