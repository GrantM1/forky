import 'regenerator-runtime/runtime';
import Recipe from './js/models/Recipe';
import Search from './js/models/Search';
import * as searchView from './js/views/searchView';
import { elements, renderLoader, clearLoader } from './js/views/base';

/* global state of the app 
 - Search object 
 - Current recipe object
 - Shopping list object 
 - Liked recipes 
*/

const state = {}


/*
SEARCH CONTROLLER
*/

const controlSearch = async () => {
  // 1) get the query from the view
  const query = searchView.getInput();
  if (query) {
    // 2) New search object and add to state
    state.search = new Search(query);

    // 3) prepare UI for the results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
      // 4) Search for the recipes
      await state.search.getResults();

      // 5) Render results on UI
      clearLoader();
      searchView.renderResults(state.search.results);

    } catch (error) {
      alert('yet another problem with the search...', error);
      clearLoader();
    }

  }
}

elements.searchForm.addEventListener('submit', event => {
  event.preventDefault();
  controlSearch();
})





elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.results, goToPage);

  }

});

/*
recipe CONTROLLER
*/

const controlRecipe = async () => {
  // get the id from URL
  const id = window.location.hash.replace('#', '');

  if (id) {
    // Prepare UI for changes 

    // Create new recipe object
    state.recipe = new Recipe(id);
    // TESTING


    try {
      // get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();


      // calculate serving and time
      state.recipe.calcTime();
      state.recipe.calcServings();

    } catch (error) {
      alert('Error processing recipe :(', error);
    }



    // Render recipe
  }
};


['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));