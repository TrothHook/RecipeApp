const meals = document.getElementById("meals");
const favMeals = document.getElementById("fav-meals");
const searchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search");
const mealPopup = document.getElementById("meal-popup");
const popupCloseBtn = document.getElementById("close-popup");
const mealInfoEl = document.getElementById("meal-info");


getRandomMeal();
fetchFavMeals();

async function getRandomMeal() {

    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");

    const respData = await resp.json();

    const randomMeal = respData.meals[0];

    addRandomMeal(randomMeal, true);
}

async function getMealById(id) {

    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);

    const respData = await resp.json();

    const mealById = respData.meals[0];

    return mealById;
}

async function getMealBySearch(name) {

    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + name);

    const respData = await resp.json();

    const MealBySearch = respData.meals;

    return MealBySearch;
}


function addRandomMeal(mealData, random = false) {
    // console.log(mealData);

    const meal = document.createElement("div");

    meal.classList.add("meal");

    meal.innerHTML = `
    <div class="meal-header">
        ${random ? `
        <span class="random">
            Random Recipe
        </span>` : ''}
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    </div>
    <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
        <button class="fav-btn">
            <i class="fas fa-heart"></i>
        </button>
    </div>`;

    const btn = meal.querySelector(".meal-body .fav-btn");

    btn.addEventListener("click", () => {

        if (btn.classList.contains("active")) {
            removeMealFromLocalStorage(mealData.idMeal);
            btn.classList.remove("active");
        } else {
            storeRandomMealInLocalStorage(mealData.idMeal);
            btn.classList.add("active");
        }

        fetchFavMeals();
    });

    meal.addEventListener("click", () => {
        showMealInfo(mealData);
    });

    meals.appendChild(meal);
}

function storeRandomMealInLocalStorage(mealId) {
    const mealIds = getMealsFromLocalStorage();

    localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function removeMealFromLocalStorage(mealId) {
    const mealIds = getMealsFromLocalStorage();

    localStorage.setItem("mealIds", JSON.stringify(mealIds.filter(id => id !== mealId)));
}

function getMealsFromLocalStorage() {
    const mealIds = JSON.parse(localStorage.getItem("mealIds"));

    return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {

    //Clean the ul
    favMeals.innerHTML = "";

    const mealIds = getMealsFromLocalStorage();

    for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i];

        const meal = await getMealById(mealId);

        addMealToFav(meal);
    }
}

function addMealToFav(mealData) {

    const favMeal = document.createElement("li");

    favMeal.innerHTML = `
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        <span>${mealData.strMeal}</span>
        <button class="clear"><i class="fa-solid fa-xmark"></i></button>`;

    const btn = favMeal.querySelector(".clear");

    btn.addEventListener("click", () => {
        removeMealFromLocalStorage(mealData.idMeal);
        fetchFavMeals();
    });

    favMeal.addEventListener("click", () => {
        showMealInfo(mealData);
    });

    favMeals.appendChild(favMeal);
}

function showMealInfo(mealData) {

    // clean it up

    mealInfoEl.innerHTML = "";

    //update the Meal Info

    const mealEl = document.createElement("div");

    const ingredients = [];

    // get ingredients and measure
    for(let i = 1; i <= 20; i++) {
        if(mealData["strIngredient" + i]) {
            ingredients.push(`${mealData["strIngredient" + i]} - ${mealData["strMeasure" + i]}`);
        } else {
            break;
        }
    }

    mealEl.innerHTML = ` 
    <h1>${mealData.strMeal}</h1>
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">

    <p>${mealData.strInstructions}</p>
    <h3>Ingredients: </h3>
    <ul>
        ${ingredients
            .map(
                (ing) => `
        <li>${ing}</li>
        `
        )
        .join("")}
    </ul>`;

    mealInfoEl.appendChild(mealEl);

    //show the popup
    mealPopup.classList.remove("hidden");
}

searchBtn.addEventListener("click", async () => {

    meals.innerHTML = "";

    const search = searchTerm.value;

    const mealsSearch = await getMealBySearch(search);

    if (mealsSearch) {
        mealsSearch.forEach(meal => {
            addRandomMeal(meal, true);
        });
    }
});

popupCloseBtn.addEventListener("click", () => {
    mealPopup.classList.add("hidden");
});