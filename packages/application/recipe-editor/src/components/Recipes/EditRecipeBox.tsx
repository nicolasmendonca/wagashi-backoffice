import React, {FormEvent} from 'react';
import produce from 'immer';
import {createIngredient, loadRecipes, loadIngredients, updateRecipe, createRecipe, Recipe} from '@wagashi-backoffice/core';
import CreatableSelect from 'react-select/creatable';
import {chakra, Button, Container, FormControl, FormLabel, HStack, Input} from '@chakra-ui/react';

import useSWR from 'swr';
import {convertFormValuesToRecipe, createIngredientFormValues, convertRecipeToForm} from './formHandlers';
import {useRecipeEditorServices} from '../../context/RecipeEditorServiceProvider';
import type {IEditRecipeBoxProps, RecipeForm} from './types';

export const EditRecipeBox: React.FC<IEditRecipeBoxProps> = ({onRecipeCreate, onRecipeUpdate, editRecipeId}) => {
  const {loadRecipesService, createIngredientService, updateRecipeService, createRecipeService, loadIngredientsService} = useRecipeEditorServices();
  const [isCreatingIngredient, setIsCreatingIngredient] = React.useState(false);
  const {data: ingredientList = [], mutate: mutateIngredients} = useSWR('ingredients', () => loadIngredients(loadIngredientsService));
  const {data: recipeList = [], mutate: mutateRecipes} = useSWR('recipes', () => loadRecipes(loadRecipesService));
  const [recipeState, setRecipeState] = React.useState<RecipeForm>(() => ({
    name: '',
    ingredients: [createIngredientFormValues()],
  }));

  React.useEffect(() => {
    if (editRecipeId && ingredientList.length > 0 && recipeList.length > 0) {
      const loadedRecipe = recipeList.find((recipe) => recipe.id === editRecipeId);
      if (!loadedRecipe) {
        return;
      }
      setRecipeState(convertRecipeToForm(loadedRecipe));
    }
  }, [editRecipeId, recipeList, ingredientList, setRecipeState]);

  const updateRecipeName = (name: string) => {
    const updatedRecipe = produce(recipeState, (draft) => {
      draft.name = name;
    });
    setRecipeState(updatedRecipe);
  };
  const updateRecipeIngredientQuantity = (ingredientIndex: number, ingredientQuantity: string) => {
    const updatedRecipe = produce(recipeState, (draft) => {
      draft.ingredients[ingredientIndex].quantity = ingredientQuantity;
    });
    setRecipeState(updatedRecipe);
  };

  const handleIngredientChange = (recipeIngredientIndex: number, newIngredientId: string) => {
    const updatedRecipe = produce(recipeState, (draft) => {
      draft.ingredients[recipeIngredientIndex].ingredientId = newIngredientId;

      const remainingIngredientFormInputs = draft.ingredients.filter((ing) => ing.ingredientId === '').length;
      // Add empty ingredient if that was the last one
      if (remainingIngredientFormInputs === 0) {
        draft.ingredients.push(createIngredientFormValues());
      }
    });
    setRecipeState(updatedRecipe);
  };

  const handleIngredientRemove = (ingredientIndex: number) => {
    const updatedRecipe = produce(recipeState, (draft) => {
      draft.ingredients.splice(ingredientIndex, 1);

      const remainingIngredientFormInputs = draft.ingredients.filter((ing) => ing.ingredientId === '').length;
      // Add empty ingredient if that was the last one
      if (remainingIngredientFormInputs === 0) {
        draft.ingredients.push(createIngredientFormValues());
      }
    });
    setRecipeState(updatedRecipe);
  };

  const handleIngredientCreate = async (ingredientIndex: number, name: string) => {
    setIsCreatingIngredient(true);
    const updatedingredients = produce(ingredientList, async (ingredientsDraft) => {
      if (!ingredientsDraft) return;
      // create the ingredient on the backend
      const createdIngredient = await createIngredient(createIngredientService, ingredientList, {
        name,
      });
      setRecipeState((recipe) =>
        produce(recipe, (recipeDraft) => {
          const savedIngredient = recipeDraft.ingredients[ingredientIndex];
          recipeDraft.ingredients[ingredientIndex] = createIngredientFormValues({
            ...savedIngredient,
            ingredientId: createdIngredient?.id,
          });
          const isAnyAvailableIngredientFormInput = recipeDraft.ingredients.some((ing) => ing.ingredientId === '');
          // Add empty ingredient if that was the last one
          if (!isAnyAvailableIngredientFormInput) {
            recipeDraft.ingredients.push(createIngredientFormValues());
          }
          setIsCreatingIngredient(false);
        })
      );
    });
    mutateIngredients(updatedingredients);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const recipe: Recipe = convertFormValuesToRecipe(recipeState);
    if (editRecipeId) {
      const updatedRecipe = await updateRecipe(updateRecipeService, loadIngredientsService, editRecipeId, recipe);
      onRecipeUpdate(updatedRecipe);
    } else {
      const createdRecipe = await createRecipe(createRecipeService, loadIngredientsService, recipe);
      onRecipeCreate(createdRecipe);
    }
  };

  if (ingredientList === null) {
    return <p>Loading</p>; // TODO add loading indicator
  }

  return (
    <Container py={6}>
      <form onSubmit={handleSubmit}>
        <FormControl mb={6}>
          <FormLabel>Nombre de la receta</FormLabel>
          <Input
            type="text"
            placeholder="Torta Kyoto"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRecipeName(e.target.value)}
            value={recipeState.name}
          />
        </FormControl>

        {recipeState.ingredients.map((recipeIngredient, index) => {
          const selectedIngredient = ingredientList.find((ingredient) => ingredient.id === recipeIngredient.ingredientId);
          return (
            <HStack key={recipeIngredient._id} my={4}>
              <StyledCreatableSelect
                placeholder="Elegí un ingrediente"
                isClearable
                isDisabled={isCreatingIngredient}
                isLoading={isCreatingIngredient}
                width="100%"
                sx={{
                  '& > div': {
                    borderColor: 'gray.200',
                    '&:hover': {
                      borderColor: 'gray.300',
                    },
                    '&:focus': {
                      borderColor: '#3182ce',
                    },
                  },
                }}
                value={
                  selectedIngredient
                    ? {
                        label: selectedIngredient.name,
                        value: selectedIngredient.id,
                      }
                    : ''
                }
                options={ingredientList.map((ingredient) => {
                  return {
                    label: ingredient.name,
                    value: ingredient.id,
                  };
                })}
                formatCreateLabel={(value: string) => (
                  <React.Fragment>
                    Agregar <b>{value}</b>
                  </React.Fragment>
                )}
                onCreateOption={(name: string) => handleIngredientCreate(index, name)}
                onChange={(option: {value: string}) => (option ? handleIngredientChange(index, option.value) : handleIngredientRemove(index))}
              />
              <FormControl>
                <Input
                  type="text"
                  aria-label="Cantidad"
                  placeholder="Cantidad"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRecipeIngredientQuantity(index, e.target.value)}
                  value={recipeIngredient.quantity}
                />
              </FormControl>
            </HStack>
          );
        })}
        <Button type="submit" colorScheme="pink">
          Guardar Receta
        </Button>
      </form>
    </Container>
  );
};

const StyledCreatableSelect = chakra(CreatableSelect, {
  shouldForwardProp: (prop: string) =>
    ['isDisabled', 'isLoading', 'isClearable', 'placeholder', 'value', 'options', 'formatCreateLabel', 'onCreateOption', 'onChange'].includes(prop),
});
