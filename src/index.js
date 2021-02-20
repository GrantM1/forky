import 'regenerator-runtime/runtime';
import Search from './js/models/Search';
import Recipe from './js/models/Recipe';
import List from './js/models/list';
import Likes from './js/models/likes';
import * as searchView from './js/views/searchView';
import * as recipeView from './js/views/recipeView';
import * as listView from './js/views/shopingListView';
import * as likesView from './js/views/likesView';
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
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Highlight selected search item
    if (state.search) searchView.highlightSelected(id);

    // Create new recipe object
    state.recipe = new Recipe(id);



    try {
      // get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();


      // calculate serving and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      // Render recipe
      clearLoader();
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id)
      );

    } catch (error) {
      console.log(error);
      alert('Error processing recipe :(', error);
    }



  }
};

// window.addEventListener('hashchange'), controlRecipe);
// window.addEventListener('load'), controlRecipe);

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));

/*
list CONTROLLER
*/

const controlList = () => {
  // create a new list IF there is none yet
  if (!state.list) state.list = new List();

  // Add each ingredient to the list and UI
  state.recipe.ingArr.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
}

//handling delete and update list item events
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // Hadle delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // Delete from the state
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});


/*
Like CONTROLLER
*/


const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  // User has NOT yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // Add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.image
    )
    // console.log(newLike);
    // Toggle the like button
    likesView.toggleLikeBtn(true);
    // Add like to the UI list
    likesView.renderLike(newLike);



    // User HAS liked current recipe
  } else {
    // Remove like to the state
    state.likes.deleteLike(currentID);
    // Toggle the like button
    likesView.toggleLikeBtn(false);
    // Remove like to the UI list
    likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};


// Restore liked recipes on page load
window.addEventListener('load', () => {
  state.likes = new Likes();

  // Restore likes
  state.likes.readStorage();

  // Toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  // render the existing likes
  state.likes.likes.forEach(like => likesView.renderLike(like));
});

// Handling recipe button clicks 
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // Deacrease button clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }

  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // Inacrease button clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, recipe__btn--add *')) {
    // Add the names to the shopping list
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // like controller
    controlLike();
  }

  // console.log(state.recipe);
});



