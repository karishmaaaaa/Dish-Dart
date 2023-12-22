document.addEventListener('DOMContentLoaded', function () {
    var search_bar = document.getElementById('searchbar');
    var meal_container = document.getElementById('mealcontainer');
    var search_results = document.getElementById('searchresults');
    var modal = document.getElementById('modal');

    search_bar.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            var searchTerm = event.target.value;
            fetchMealsByCategory(searchTerm);
        }
    });

    meal_container.addEventListener('click', function (event) {
        var mealId = event.target.dataset.mealId;
        if (mealId) {
            fetchMealDetails(mealId);
        }
    });

    search_results.addEventListener('click', function (event) {
        var mealId = event.target.dataset.mealId;
        if (mealId) {
            fetchMealDetails(mealId);
        }
    });

    modal.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    fetchRandomMeal();

    function fetchRandomMeal() {
        var apiUrl = 'https://www.themealdb.com/api/json/v1/1/random.php';

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => displayMeal(data.meals[0]))
            .catch(error => console.error('Error fetching random meal:', error));
    }

    function displayMeal(meal) {
        meal_container.innerHTML = `
            <div class="resultCard" data-meal-id="${meal.idMeal}">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
            </div>
        `;
    }
    //the function display meal category
    function fetchMealsByCategory(category) {
        var apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => displaySearchResults(data.meals))
            .catch(error => console.error('Error fetching meals by category:', error));
    }

    function displaySearchResults(meals) {
        search_results.innerHTML = '';

        if (!meals) {
            search_results.innerHTML = '<p>No results found</p>';
            return;
        }
        meals.slice(0, 16).forEach(meal => {
            var resultCard = document.createElement('div');
            resultCard.classList.add('resultCard');
            resultCard.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
            `;
            resultCard.dataset.mealId = meal.idMeal;
            search_results.appendChild(resultCard);
        });
    }
    function fetchMealDetails(mealId) {
        var apiUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => displayMealDetails(data.meals[0]))
            .catch(error => console.error('Error fetching meal details:', error));
    }

    function displayMealDetails(meal) {
        var mealDetails = document.getElementById('mealDetails');
        mealDetails.innerHTML = `
            <h3>${meal.strMeal}</h3>
            <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
            <h4>Ingredients</h4>
            <ol>${displayIngredients(meal)}</ol>
        `;

        modal.style.display = 'block';
    }

    function displayIngredients(meal) {
        let ingredients = '';
        for (let i = 1; i <= 20; i++) {
            var ingredient = meal['strIngredient' + i];
            var measure = meal['strMeasure' + i];
            if (ingredient && ingredient.trim() !== '') {
                ingredients += `<li>${measure} ${ingredient}</li>`;
            }
        }
        return ingredients;
    }

    function closeModal() {
        modal.style.display = 'none';
    }

});
