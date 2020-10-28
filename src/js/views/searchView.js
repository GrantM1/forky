import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = '';
}
export const clearResults = () => {
  elements.searchResList.innerHTML = '';
}

// 'Pasta with tomato and spinach' - test string

const limitRecipetitle = (title, limit = 17) => {
  if (title.length > limit) {
    const newTitle = [];
    title.split(' ').reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    return `${newTitle.join(' ')} ...`;
  }
  return title;
}

console.log(limitRecipetitle('Pasta with tomato and spinach'));

const renderRecipe = recipe => {

  const markup = `
        <li>
          <a class="results__link" href="#${recipe.id}">
            <figure class="results__fig">
              <img src="${recipe.image}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
              <h4 class="results__name">${limitRecipetitle(recipe.title)}</h4>
              <p class="results__author">The Pioneer Woman</p>
            </div>
          </a>
      </li>
  `;


  elements.searchResList.insertAdjacentHTML('beforeend', markup)
}

export const renderResults = recipes => {
  recipes.forEach(renderRecipe);
  // console.log(recipes);
}