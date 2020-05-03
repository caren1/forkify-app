import axios from 'axios';

// each recipe will be identified with an ID
// later on will use it on AJAX call to get more data
export default class Recipe {
    constructor(id) {
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

        } catch (error) {
            console.log(error);
            alert('')
        }
    }

    calcTime() {
        // we assume  that we need 15 minutes for each 3 ingredients
        // array of ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {

        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];
        //              ^ - destructuring ES6

        const newIngredients = this.ingredients.map(el => {
            // 1) uniform units

            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2) remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3) parse ingredients into count, unit and ingredient
             // 1 - if there is actually a unit in the string if so, where it is located
                const arrIng = ingredient.split(' ');
             // for each element it will test if that element is inside unitsShort array -> will return an index when this test will return true
                const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                // there is a unit
                // example: 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2" -> 4.5)
                // example: 4 cups, arrCount is [4];
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if (arrCount.length === 1){
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0], 10)) {
                // ^ we are taking the first element of the array and we convert it to a number
                // if conversion is successful it will return that number -> true
                // there is no unit, but 1st element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // there is no unit and no number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;

        });
        this.ingredients = newIngredients;
    }

    // increase or decrease = type
    updateServings (type){
        // servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        
        // ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}