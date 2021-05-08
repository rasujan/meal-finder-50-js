"use strict";
exports.__esModule = true;
var search = document.getElementById("search");
var searchSuggestions = (document.getElementById("search-suggestions"));
var submit = document.getElementById("submit");
var random = document.getElementById("random-btn");
var mealEle = document.getElementById("meals");
var resultsHeading = (document.getElementById("results-heading"));
var singleMealEle = document.getElementById("single-meal");
var baseURL = "https://www.themealdb.com/api/json/v1/1/";
//Card element for search result card
var mealEleCard = function (props) {
    return "\n        <div class=\"meal\">\n            <img src=\"" + props.strMealThumb + "\" alt=\"" + props.strMeal + "\" />\n            <div class=\"meal-info\" data-mealID=\"" + props.idMeal + "\">\n                <h3> " + props.strMeal + " </h3>\n            </div>\n        </div>\n    ";
};
//Search meal func to fetch the meal from API
function searchMeal(e) {
    e.preventDefault();
    // Clear single meal
    singleMealEle.innerHTML = "";
    // Get search term
    var searchedTerm = search.value;
    //CHECK IF SEARCH IS EMPTY
    //if(searchedTerm.trim()) can also be used to check is the field is empty
    if (searchedTerm !== "") {
        fetch(baseURL + "search.php?s=" + searchedTerm)
            .then(function (res) { return res.json(); })
            .then(function (data) {
            if (data.meals === null) {
                resultsHeading.innerHTML = "<p> No results found for " + searchedTerm + "! </p>";
            }
            else {
                resultsHeading.innerHTML = "<p> Showing results for '" + searchedTerm + "' </p>";
                mealEle.innerHTML = data.meals
                    .map(function (meal) { return mealEleCard(meal); })
                    .join("");
                search.value = "";
            }
        });
    }
    else {
        alert("Please enter the search term");
    }
}
//Suggest Meal functions
function suggestMeal() {
    // Get search term
    setTimeout(function () {
        var searchedTerm = search.value;
        if (searchedTerm !== "") {
            fetch(baseURL + "search.php?s=" + searchedTerm)
                .then(function (res) { return res.json(); })
                .then(function (data) {
                if (data.meals === null) {
                }
                else {
                    searchSuggestions.innerHTML = data.meals
                        .map(function (meal) { return "<option value=" + meal.strMeal + "/>"; })
                        .join("");
                }
            });
        }
        else {
        }
    }, 500);
}
//Get Meal By ID
var getMealByID = function (id) {
    fetch(baseURL + "lookup.php?i=" + id)
        .then(function (res) { return res.json(); })
        .then(function (data) {
        var meal = data.meals[0];
        addMealToDOM(meal);
    })["catch"](function (err) {
        console.error(err);
    });
};
var getRandom = function () {
    fetch(baseURL + "random.php")
        .then(function (res) { return res.json(); })
        .then(function (data) {
        var meal = data.meals[0];
        // console.log("🚀 ~ file: script.ts ~ line 97 ~ .then ~ meal", meal);
        addMealToDOM(meal);
    })["catch"](function (err) {
        console.error(err);
    });
};
//Add meal to DOM
function addMealToDOM(meal) {
    // // console.log("🚀 ~ file: script.ts ~ line 95 ~ addMealToDOM ~ meal", meal);
    var ingredients = [];
    for (var i = 1; i <= 20; i++) {
        if (meal["strIngredient" + i]) {
            ingredients.push(meal["strIngredient" + i] + " \uD83D\uDC49 " + meal["strMeasure" + i]);
        }
        else {
            break;
        }
    }
    singleMealEle.innerHTML = "<div class=\"single-meal\"> \n      <h1> " + meal.strMeal + " </h1> \n      <img src=\"" + meal.strMealThumb + "\" alt=\"" + meal.strMeal + "\" />\n      <div class=\"single-meal-info\">\n        " + (meal.strCategory ? "<p>" + meal.strCategory + "</p>" : "") + "\n        " + (meal.strArea ? "<p>" + meal.strArea + "</p>" : "") + "\n      </div>\n      <div class=\"main\">\n          <p> " + meal.strInstructions + " </p>\n          <h2> Ingredirents </h2>\n          <ol>\n              " + ingredients.map(function (ing) { return "<li>" + ing + "</li>"; }).join("") + "\n          </ol>\n\n      </div>\n  </div>";
}
//Event listners
submit.addEventListener("submit", searchMeal);
random.addEventListener("click", getRandom);
search.oninput = suggestMeal;
mealEle.addEventListener("click", function (e) {
    var mealInfo = e.path.find(function (item) {
        var _a;
        return (_a = item === null || item === void 0 ? void 0 : item.classList) === null || _a === void 0 ? void 0 : _a.contains("meal-info");
    });
    if (mealInfo) {
        var mealID = mealInfo.getAttribute("data-mealid");
        getMealByID(mealID);
    }
});
