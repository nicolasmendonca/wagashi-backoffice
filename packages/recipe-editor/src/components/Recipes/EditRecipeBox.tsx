import React, {FormEvent} from 'react';
import produce from 'immer';
import {
  createIngredient,
  loadRecipes,
  loadIngredients,
  updateRecipe,
  createRecipe,
} from '@wagashi-backoffice/core';
import CreatableSelect from 'react-select/creatable';
import {chakra, Button, Container, FormControl, FormLabel, HStack, Input} from '@chakra-ui/react';
import {Recipe} from '@wagashi-backoffice/core';

import useSWR from 'swr';
import {IEditRecipeBoxProps, RecipeForm} from './types';
import {
  convertFormValuesToRecipe,
  createIngredientFormValues,
  convertRecipeToForm,
} from './formHandlers';
import {useRecipeEditorServices} from '../../context/RecipeEditorServiceProvider';

export const EditRecipeBox: React.FC<IEditRecipeBoxProps> = ({onRecipeSave, editRecipeId}) => {
  const {
    loadRecipesService,
    createIngredientService,
    updateRecipeService,
    createRecipeService,
    loadIngredientsService,
  } = useRecipeEditorServices();
  const {data: ingredientList = [], revalidate} = useSWR('ingredients', () =>
    loadIngredients(loadIngredientsService)
  );
  const {data: recipeList = []} = useSWR('recipes', () => loadRecipes(loadRecipesService));
  const [recipeState, setRecipeState] = React.useState<RecipeForm>(() => ({
    name: '',
    ingredients: [createIngredientFormValues()],
  }));

  React.useEffect(() => {
    if (editRecipeId && ingredientList.length > 0 && recipeList.length > 0) {
      const loadedRecipe = recipeList.find((recipe) => recipe.id === editRecipeId);
      if (!loadedRecipe) {
        throw new Error('Recipe not found');
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

      const isLastIngredientFormInputFilled =
        draft.ingredients[draft.ingredients.length - 1].ingredientId !== '';
      // Add empty ingredient if that was the last one
      if (isLastIngredientFormInputFilled) {
        draft.ingredients.push(createIngredientFormValues());
      }
    });
    setRecipeState(updatedRecipe);
  };

  const handleIngredientRemove = (ingredientIndex: number) => {
    const updatedRecipe = produce(recipeState, (draft) => {
      draft.ingredients.splice(ingredientIndex, 1);

      const remainingIngredientFormInputs = draft.ingredients.length;
      // Add empty ingredient if that was the last one
      if (remainingIngredientFormInputs === 0) {
        draft.ingredients.push(createIngredientFormValues());
      }
    });
    setRecipeState(updatedRecipe);
  };

  const handleIngredientCreate = async (ingredientIndex: number, name: string) => {
    const ingredient = await createIngredient(createIngredientService, loadIngredientsService, {
      name,
    });
    await revalidate();
    handleIngredientChange(ingredientIndex, ingredient.id);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const recipe: Recipe = convertFormValuesToRecipe(recipeState);

    const savedRecipe = editRecipeId
      ? await updateRecipe(updateRecipeService, editRecipeId, recipe)
      : await createRecipe(createRecipeService, loadIngredientsService, recipe);
    onRecipeSave(savedRecipe);
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
          const selectedIngredient = ingredientList.find(
            (ingredient) => ingredient.id === recipeIngredient.ingredientId
          );
          return (
            <HStack key={recipeIngredient._id} my={4}>
              <StyledCreatableSelect
                placeholder="Elegí un ingrediente"
                isClearable
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
                onChange={(option: {value: string}) =>
                  option
                    ? handleIngredientChange(index, option.value)
                    : handleIngredientRemove(index)
                }
              />
              <FormControl>
                <Input
                  type="text"
                  aria-label="Cantidad"
                  placeholder="Cantidad"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateRecipeIngredientQuantity(index, e.target.value)
                  }
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
    [
      'isClearable',
      'placeholder',
      'value',
      'options',
      'formatCreateLabel',
      'onCreateOption',
      'onChange',
    ].includes(prop),
});
