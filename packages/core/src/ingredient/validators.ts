import { Ingredient, IngredientWithId } from './entities';

// Use Case Validators -----------------------

export const validateCreateIngredient = async (ingredientList: IngredientWithId[], ingredient: Ingredient) => {
  // Validate ingredient name is not empty
  await validateIngredientHasName(ingredient);
  await validateIngredientNameIsUnique(ingredientList, ingredient);
  return ingredient;
}


// Single Responsibility Validators -----------------------
const validateIngredientHasName = async (ingredient: Ingredient) => {
  if (!ingredient.name) {
    throw new Error(`El ingrediente debe contener un nombre`)
  }
  return ingredient;
}

const validateIngredientNameIsUnique = async (ingredientList: IngredientWithId[], ingredient) => {
  const matchedIngredient = ingredientList.find(savedIngredient => savedIngredient.name === ingredient.name)
  if (matchedIngredient) {
    throw new Error(`El ingrediente ${ingredient.name} ya existe`)
  }
  return ingredient;
}

export const validateIngredientExists = async (ingredientList: IngredientWithId[], ingredientId: string) => {
  const matchedIngredient = ingredientList.find(savedIngredient => savedIngredient.id === ingredientId);
  if (!matchedIngredient) {
    // TODO crear si no existe
    throw new Error(`El ingrediente ${ingredientId} no existe`); 
  }
  return matchedIngredient;
}
