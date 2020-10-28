import axios from 'axios';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const key = 'cf5fd469d3b74a3b9f8da3377cac013f';
    try {
      const dataReq = await axios(`${proxy}https://api.spoonacular.com/recipes/complexSearch?apiKey=${key}&query=${this.query}`);
      this.results = dataReq.data.results;
      // console.log(this.results);
    } catch (error) {
      alert(error)
    }
  }
}




