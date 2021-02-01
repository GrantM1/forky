import axios from 'axios';

import { key, proxy } from '../config';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {

    try {
      const dataReq = await axios(`${proxy}https://api.spoonacular.com/recipes/complexSearch?apiKey=${key}&query=${this.query}`);
      this.results = dataReq.data.results;
    } catch (error) {
      alert("error with a search", error)
    }
  }
}




