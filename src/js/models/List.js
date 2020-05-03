import uniqid from 'uniqid';
import { elements } from '../views/base';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem (count, unit, ingredient){
        const item = {
            // we will implement uniqid package to create unique id
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem (id) {

        const index = this.items.findIndex(el => el.id === id)

        /* what does splice do? -> we pass in a start index and then how many positions we want to take, and then returns
        those elements and delete them from original Array. */

        /* slice -> difference that slice accepts start and end index of a portion we want to take
        and then returns a new array. It doesnt mutate the original array */

        // [2,4,8] splice (1, 2) -> will return 4 and 8 and mutate the orignal array = [2]
        // [2,4,8] slice (1, 2) -> will return 4 and mutate the orignal array = [2,8] as last index is not included
        this.items.splice(index, 1);
    }

    updateCount(id, newCount){
        this.items.find(el => el.id === id).count = newCount;
        // we loop over the elements in items array and select the one with id equal to id we pass into function
    }
}