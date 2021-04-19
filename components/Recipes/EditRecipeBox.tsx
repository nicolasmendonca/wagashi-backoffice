import React, {FormEvent} from 'react';
import produce from 'immer';
import CreatableSelect from 'react-select/creatable';
import {chakra, Button, Container, FormControl, FormLabel, HStack, Input} from '@chakra-ui/react';
import {Recipe} from 'core/entities/recipe';
import {useApp} from 'context/App';
import useSWR from 'swr';
import { IEditRecipeBoxProps, RecipeForm } from './types';
import {convertFormValuesToRecipe, createIngredientFormValues, convertRecipeToForm} from './formHandlers'

export const EditRecipeBox: React.FC<IEditRecipeBoxProps> = ({onRecipeSave, editRecipeId}) => {
  const app = useApp();
  const {data: ingredientList = [], revalidate} = useSWR('ingredients', app.loadIngredients);
  const {data: recipeList = []} = useSWR('recipes', app.loadRecipes);
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

      const isLastIngredientFormInputFilled = draft.ingredients[ draft.ingredients.length - 1 ].ingredientId !== '';
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
    const ingredient = await app.createIngredient({name});
    await revalidate();
    handleIngredientChange(ingredientIndex, ingredient.id);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const recipe: Recipe = convertFormValuesToRecipe(recipeState);

    const savedRecipe = editRecipeId
      ? await app.updateRecipe(editRecipeId, recipe)
      : await app.createRecipe(recipe);
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
            onChange={(e) => updateRecipeName(e.target.value)}
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
                    ? {label: selectedIngredient.name, value: selectedIngredient.id}
                    : ''
                }
                options={ingredientList.map((ingredient) => {
                  return {
                    label: ingredient.name,
                    value: ingredient.id,
                  };
                })}
                formatCreateLabel={(value: string) => (
                  <>
                    Agregar <b>{value}</b>
                  </>
                )}
                onCreateOption={(name: string) => handleIngredientCreate(index, name)}
                onChange={(option) =>
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
                  onChange={(e) => updateRecipeIngredientQuantity(index, e.target.value)}
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
  shouldForwardProp: (prop) =>
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
