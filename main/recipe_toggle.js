// Fetch recipes from backend database

document.addEventListener("DOMContentLoaded", function () {

    fetch("http://localhost:3000/recipes")
    .then(function(response){
        return response.json();
    })
    .then(function(data){

        const container = document.getElementById("recipes-container");

        if(!container){
            console.log("recipes-container not found");
            return;
        }

        container.innerHTML = "";

        data.forEach(function(recipe){

            const recipeBox = document.createElement("div");

            recipeBox.innerHTML = `
                <h3>${recipe.name}</h3>
                <p>${recipe.description}</p>
                <hr>
            `;

            container.appendChild(recipeBox);

        });

    })
    .catch(function(error){
        console.log("Error loading recipes:", error);
    });

});