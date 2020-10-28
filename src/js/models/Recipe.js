import axios from 'axios';
import { key, proxy } from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }
  async getRecipe() {
    try {
      const dataReq = await axios(`${proxy}https://api.spoonacular.com/recipes/${this.id}/information?apiKey=${key}`);
      this.title = dataReq.data.title;
      this.author = dataReq.data.sourceName;
      this.image = dataReq.data.image;
      this.url = dataReq.data.sourceUrl;
      this.instructions = dataReq.data.instructions;
      this.ingridients = dataReq.data.extendedIngredients;
    } catch (error) {
      console.log(error);
      alert(`Something went wrong :(`)
    }
  }
  calcTime() {
    // assuming that we need 15 min for each 3 ingredients
    const numIng = this.ingridients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }
  calcServings() {
    this.servings = 4;
  }
} 