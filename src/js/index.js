import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
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

        }catch(error){
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

        // create new recipe object
        state.recipe = new Recipe(id);

        try {
            // get the recipe data
            await state.recipe.getRecipe();

            // calculate time and calculate servings
            state.recipe.calcTime();
            state.recipe.calcServings();

            // render recipe
            console.log(state.recipe);

        } catch (error) {
            alert("error procesing recipe.");
        }
    }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));