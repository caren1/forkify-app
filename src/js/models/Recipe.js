import axios from 'axios';


// each recipe will be identified with an ID
// later on will use it on AJAX call to get more data
export default class Recipe {
    constructor(id){
        this.id = id;
    }

    async getRecipe() {
        try {
            // axios call will return a promise
            const URL = "https://forkify-api.herokuapp.com/";
            const res = await axios(`${URL}api/get?rId=${this.id}`);

            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.image = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
            
        }catch (error){
            console.log(error);
            alert('')
        }
    }

    calcTime(){
        // we assume  that we need 15 minutes for each 3 ingredients
        // array of ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }
}