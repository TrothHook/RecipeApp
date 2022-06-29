const meals = document.getElementById("meals");




async function getRandomMeal() {

    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");

    const respData = await resp.json();

    const randomMeal = respData.meals[0];

    addMeal(randomMeal, true);
}

async function getMealById(id) {
    const mealById = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+id);
}

async function getMealBySearch(name) {
    const mealByName = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s="+name);
}

getRandomMeal();