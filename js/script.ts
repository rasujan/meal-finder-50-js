export {};
const search = <HTMLInputElement>document.getElementById("search");
const searchSuggestions = <HTMLDataListElement>(
  document.getElementById("search-suggestions")
);
const submit = document.getElementById("submit");
const random = <HTMLButtonElement>document.getElementById("random-btn");
const mealEle = <HTMLDivElement>document.getElementById("meals");
const resultsHeading = <HTMLDivElement>(
  document.getElementById("results-heading")
);
const singleMealEle = <HTMLDivElement>document.getElementById("single-meal");

const baseURL = "https://www.themealdb.com/api/json/v1/1/";

//Card element for search result card
const mealEleCard = (props) => {
  return `
        <div class="meal">
            <img src="${props.strMealThumb}" alt="${props.strMeal}" />
            <div class="meal-info" data-mealID="${props.idMeal}">
                <h3> ${props.strMeal} </h3>
            </div>
        </div>
    `;
};
//Search meal func to fetch the meal from API
function searchMeal(e: Event) {
  e.preventDefault();

  // Clear single meal
  singleMealEle.innerHTML = "";

  // Get search term
  const searchedTerm = search.value;

  //CHECK IF SEARCH IS EMPTY
  //if(searchedTerm.trim()) can also be used to check is the field is empty
  if (searchedTerm !== "") {
    fetch(`${baseURL}search.php?s=${searchedTerm}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.meals === null) {
          resultsHeading.innerHTML = `<p> No results found for ${searchedTerm}! </p>`;
        } else {
          resultsHeading.innerHTML = `<p> Showing results for '${searchedTerm}' </p>`;
          mealEle.innerHTML = data.meals
            .map((meal) => mealEleCard(meal))
            .join("");
          search.value = "";
        }
      });
  } else {
    alert("Please enter the search term");
  }
}

//Suggest Meal functions
function suggestMeal() {
  // Get search term
  setTimeout(() => {
    const searchedTerm = search.value;
    if (searchedTerm !== "") {
      fetch(`${baseURL}search.php?s=${searchedTerm}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.meals === null) {
          } else {
            searchSuggestions.innerHTML = data.meals
              .map((meal) => `<option value=${meal.strMeal}/>`)
              .join("");
          }
        });
    } else {
    }
  }, 500);
}

//Get Meal By ID
const getMealByID = (id: string) => {
  fetch(`${baseURL}lookup.php?i=${id}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    })
    .catch((err) => {
      console.error(err);
    });
};

const getRandom = () => {
  fetch(`${baseURL}random.php`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      // console.log("🚀 ~ file: script.ts ~ line 97 ~ .then ~ meal", meal);
      addMealToDOM(meal);
    })
    .catch((err) => {
      console.error(err);
    });
};

//Add meal to DOM
function addMealToDOM(meal) {
  // // console.log("🚀 ~ file: script.ts ~ line 95 ~ addMealToDOM ~ meal", meal);
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} 👉 ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  singleMealEle.innerHTML = `<div class="single-meal"> 
      <h1> ${meal.strMeal} </h1> 
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
      </div>
      <div class="main">
          <p> ${meal.strInstructions} </p>
          <h2> Ingredirents </h2>
          <ol>
              ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
          </ol>

      </div>
  </div>`;
}

//Event listners
submit.addEventListener("submit", searchMeal);
random.addEventListener("click", getRandom);

search.oninput = suggestMeal;

mealEle.addEventListener("click", (e: MouseEvent | any) => {
  const mealInfo = e.path.find((item) => {
    return item?.classList?.contains("meal-info");
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");

    getMealByID(mealID);
  }
});
