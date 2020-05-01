import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/* Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes 
 */

const state = {};

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

        // 4) - search for a recipes
        await state.search.getResults();

        // 5) - render results on the UI ; only after received a results from API
        clearLoader();
        searchView.renderResults(state.search.results);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});
