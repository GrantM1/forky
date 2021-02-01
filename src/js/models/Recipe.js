import axios from 'axios';
import { key, proxy } from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }
  async getRecipe() {
    const ingArr = [];

    try {
      this.ingArr = ingArr;
      const dataReq = await axios(`${proxy}https://api.spoonacular.com/recipes/${this.id}/information?apiKey=${key}`);
      this.title = dataReq.data.title;
      this.author = dataReq.data.sourceName;
      this.image = dataReq.data.image;
      this.url = dataReq.data.sourceUrl;
      this.instructions = dataReq.data.instructions;
      this.extendedIngredients = dataReq.data.extendedIngredients;
      dataReq.data.extendedIngredients.forEach(element => {
        ingArr.push(`${element.name} ${element.amount} ${element.unit}`)
      });
    } catch (error) {
      alert(`Something went wrong :(`)
    }
  }
  calcTime() {
    // assuming that we need 15 min for each 3 ingredients
    const numIng = this.extendedIngredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }
  calcServings() {
    this.servings = 4;
  }
  parseIngredients() {
    const unitsLong = ['tablespoon', 'tablespoons', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pound'];
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

    const newIngredients = this.ingArr.map(el => {
      // 1) Uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      })
      // 2) Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\ */g, ' ');

      // 3) Parse ingredients into count, unit and ingredient
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex(el3 => unitsShort.includes(el3));
      const count3 = parseFloat(arrIng.slice(unitIndex - 1, unitIndex).join(" "));
      const arrCount = arrIng.slice(0, unitIndex - 1).join(" ");
      console.log(unitIndex);

      let objIng;
      objIng = {
        count: count3,
        unit: arrIng[unitIndex],
        ingredient: arrCount
      };
      if (unitIndex === -1) {
        objIng.unit = arrIng[arrIng.length - 1] || 'piece/pieces';
      }

      // if (unitIndex > - 1) {
      // there is a unit
      // Example 1/2 cups, arrCount is [0, 1/2]
      // Example 6 (round number), arr COunt will be [6]
      // const arrCount = arrIng.slice(0, unitIndex);
      // console.log(arrCount);
      // let count;
      // if (arrCount.length === 1) {
      //   count = arrIng[0]
      // }
      //  else {
      //   count = eval(arrIng.slice(0, unitIndex).join('+'));
      // }


      //   objIng = {
      //     count,
      //     unit: arrIng[unitIndex],
      //     ingredient: arrIng.slice(unitIndex + 1).join(' ')
      //   }

      // } else if (parseInt(arrIng[0], 10)) {
      //   // There is NO unit, but 1st element is a number 
      //   objInt = {
      //     count: parseInt(arrIng[0], 10),
      //     unit: '',
      //     ingredient: arrIng.slice(1).join(' ')
      //   }
      // } else if (unitIndex === -1) {
      //   objIng = {
      //     count: 1,
      //     unit: '',
      //     ingredient
      //   }
      // there is NO unit and NO number at first position
      // }
      // return objIng;
      return objIng;

    });
    console.log(newIngredients);
  }
}  