import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }
 
    async getResults() {
        try {
            const URL = "https://forkify-api.herokuapp.com/";
            const res = await axios(`${URL}api/search?&q=${this.query}`);
            this.results = res.data.recipes;
        } catch (error) {
            alert(error);
        }
    }
}