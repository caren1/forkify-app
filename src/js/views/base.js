export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe')
};

export const elementStrings = {
    loader: 'loader'
};

export const renderLoader = parent => {
    const loader = `
    <div class="${elementStrings.loader}">
        <svg>
            <use href="img/icons.svg#icon-cw"></use>
        </svg>
    </div>`;

    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    // delegated to separate object for usability and consistency
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if(loader){
        // in order to remove the element, we need to move up to parent element
        loader.parentElement.removeChild(loader);
    }
};