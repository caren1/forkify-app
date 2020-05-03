import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

import {
    elements,
    renderLoader,
    clearLoader
} from './views/base';

/* Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes 
 */

const state = {};

/* Search Controller */
const controlSearch = async () => {
    // 1) - getting a query from the view
    const query = searchView.getInput(); // TODO taken from searchView
    if (query) {
        // 2) - creating new search object and add to state
        state.search = new Search(query);

        // 3) - preparing the UI for results 
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4) - search for a recipes
            await state.search.getResults();

            // 5) - render results on the UI ; only after received a results from API
            clearLoader();
            searchView.renderResults(state.search.results);

        } catch (error) {
            // alert("something wrong with the search");
            console.log(error);
            
            clearLoader();
        }

    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});


// event delegation with parent element and .closest method
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        // returned a string, so there is a need to convert it
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.results, goToPage);
    }
});


/* Recipe Controller */

const controlRecipe = async () => {
    // getting the ID hash from URL
    // entire url -> window.location
    // only hash -> window.location.hash
    const id = window.location.hash.replace('#', '');
    // console.log(id);

    if (id) {

        // prepare the UI for changes
        renderLoader(elements.recipe);
        recipeView.clearRecipe();

        // highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        // create new recipe object
        state.recipe = new Recipe(id);

        try {
            // get the recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // calculate time and calculate servings
            state.recipe.calcTime();
            state.recipe.calcServings();

            // render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );

        } catch (error) {
            alert("error procesing recipe.");
        }
    }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/* List controller */

const controlList = () => {
    // create a new list if there is none yet
    if (!state.list) state.list = new List();

    // add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

// handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // handle delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete from stat
        state.list.deleteItem(id);

        // delete from UI
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    }
})


/* Like controller */
state.likes = new Likes();
likesView.toggleLikeMenu(state.likes.getNumLikes());
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    // user has not yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // 1 - add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.image
        );

        // 2 - toggle the like button
        likesView.toggleLikeBtn(true);

        // 3 - add like to the UI list
        likesView.renderLike(newLike);

    } else {
        // user has liked the current recipe

        // 1 - remove like from the state
        state.likes.deleteLike(currentID);

        // 2 - toggle the like button
        likesView.toggleLikeBtn(false);

        // 3 - remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};



/* we use event delegation, becasue buttons is not yet on the page
 there is only recipe present, so thats where we'll attach an eventlistener 
 then use the .target property of an event in order to figure out where the click happened */
/* handling recipe button clicks */

elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // adding ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // like controller
        controlLike();
    }
});