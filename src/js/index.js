import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
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
            alert("something wrong with the search");
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
            console.log(id);

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
                    recipeView.renderRecipe(state.recipe);

                } catch (error) {
                    // alert("error procesing recipe.");
                }
            }
        }

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/* we use event delegation, becasue buttons is not yet on the page
 there is only recipe present, so thats where we'll attach an eventlistener 
 then use the .target property of an event in order to figure out where the click happened */
/* handling recipe button clicks */

elements.recipe.addEventListener('click', e => {
    
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        // decrease button is clicked
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if(e.target.matches('.btn-increase, .btn-increase *')){
        // increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
});


