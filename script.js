const meals = document.getElementById("meals");
const favMeals = document.getElementById("fav-meals");


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

    const MealBySearch = respData.meals[0];

    addMealsBySearch(MealBySearch, true);
}


function addRandomMeal(mealData, random = false) {
    console.log(mealData);

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

    favMeals.appendChild(favMeal);
}