import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
  // 1) Get query from view
  const query = searchView.getInput();

  if (query) {
    // 2) New search object and state
    state.search = new Search(query);

    // 3) Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
      // 4) Search for recipes
      await state.search.getResults();
  
      // 5) Render results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      alert('Somthing went wrong with search.');
      clearLoader();
    }
  }
}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
})

elements.searchResPages.addEventListener('click', e => {
  e.preventDefault();
  const btn = e.target.closest('.btn-inline');
  if(btn){
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage)
    console.log(goToPage);
  }
})

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
  // Get ID from url
  const id = window.location.hash.replace('#', '');
  console.log(id);

  if (id) {
    // Prepare Ui for changes

    // Create new recipe object 
    state.recipe = new Recipe(id);

    try {
      // Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      console.log(state.recipe.result)
      state.recipe.parseIngredients();
  
      // Calcauate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();
  
      // Render recipe
      console.log(state.recipe);
    } catch (error) {
      alert('Error catching recipe.');
      console.log(error);
    }
  }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
