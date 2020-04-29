import Search from './models/Search';

/* Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes 
 */

const state = {};

const controlSearch = async () => {
    // 1) - getting a query from the view
    const query = 'pizza'; // TODO taken from searchView
    if (query) {
        // 2) - creating new search object and add to state
        state.search = new Search(query);

        // 3) - preparing the UI for results 

        // 4) - search for a recipes
        await state.search.getResults();

        // 5) - render results on the UI ; only after received a results
        console.log(state.search.result);


    }
}

document.querySelector('.search').addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});
