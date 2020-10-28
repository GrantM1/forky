import 'regenerator-runtime/runtime';
import Search from './js/models/Search';
import * as searchView from './js/views/searchView';
import { elements } from './js/views/base';

/* global state of the app 
 - Search object 
 - Current recipe object
 - Shopping list object 
 - Liked recipes 
*/

const state = {};

const controlSearch = async () => {
  // 1) get the query from the view
  const query = searchView.getInput(); // TODO later
  console.log(query);
  if (query) {
    // 2) New search object and add to state
    state.search = new Search(query);

    // 3) prepare UI for the results
    searchView.clearInput();
    searchView.clearResults();

    // 4) Search for the recipes
    await state.search.getResults();

    // 5) Render results on UI
    searchView.renderResults(state.search.results);
  }
}

elements.searchForm.addEventListener('submit', event => {
  event.preventDefault();
  controlSearch();
})

