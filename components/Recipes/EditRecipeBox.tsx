import React, {FormEvent} from 'react';
import produce from 'immer';
import CreatableSelect from 'react-select/creatable';
import {chakra, Button, Container, FormControl, FormLabel, HStack, Input} from '@chakra-ui/react';
import {Recipe} from 'entities/recipe';
import {generateId} from 'utils/id';
import {RecipeForm, parseRecipeToForm, parseFormToRecipe} from './parser';

interface IEditRecipeBoxProps {
  recipe?: Recipe;
  onRecipeSave: (recipe: Recipe) => void;
}

export const emptyRecipe: Recipe = {
  name: '',
  ingredients: [
    {
      name: '',
      quantity: 0,
    },
  ],
};

export const EditRecipeBox: React.FC<IEditRecipeBoxProps> = ({
  recipe: recipeProp,
  onRecipeSave,
}) => {
  const [recipeState, setRecipeState] =
    React.useState < RecipeForm > (() => parseRecipeToForm(recipeProp || emptyRecipe));

  const updateRecipeName = (name: string) =>
    setRecipeState(
      produce(recipeState, draft => {
        draft.name = name;
      })
    );
  const updateRecipeIngredientName = (ingredientIndex: number, ingredientName: string) => {
    setRecipeState(
      produce(recipeState, draft => {
        draft.ingredients[ingredientIndex].name = ingredientName;

        if (draft.ingredients[draft.ingredients.length - 1].name !== '') {
          draft.ingredients.push({
            id: generateId(),
            name: '',
            quantity: '',
          });
        }
      })
    );
  };
  const updateRecipeIngredientQuantity = (ingredientIndex: number, ingredientQuantity: string) => {
    setRecipeState(
      produce(recipeState, draft => {
        draft.ingredients[ingredientIndex].quantity = ingredientQuantity;
      })
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onRecipeSave(parseFormToRecipe(recipeState));
  };

  return (
    <Container py={6}>
      <form onSubmit={handleSubmit}>
        <FormControl mb={6}>
          <FormLabel>Nombre de la receta</FormLabel>
          <Input
            type="text"
            placeholder="Torta Kyoto"
            onChange={e => updateRecipeName(e.target.value)}
            value={recipeState.name}
          />
        </FormControl>

        {recipeState.ingredients.map((ingredient, index) => {
          return (
            <HStack key={ingredient.id} my={4}>
              <StyledCreatableSelect
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
                options={[
                  {
                    value: 'crema',
                    label: 'Crema',
                  },
                  {
                    value: 'chocolate',
                    label: 'Chocolate',
                  },
                  {
                    value: 'azucar',
                    label: 'Azucar',
                  },
                ]}
                formatCreateLabel={(value: string) => (
                  <>
                    Agregar <b>{value}</b>
                  </>
                )}
                onCreateOption={(value: string) => {
                  // @TODO: Seguir aca
                }}
              />
              <FormControl>
                <Input
                  type="text"
                  aria-label="Cantidad"
                  placeholder="Cantidad"
                  onChange={e => updateRecipeIngredientQuantity(index, e.target.value)}
                  value={ingredient.quantity}
                />
              </FormControl>
            </HStack>
          );
        })}
        <Button type="submit" colorScheme="pink">
          {recipeProp === undefined ? 'Crear Receta' : 'Guardar Receta'}
        </Button>
      </form>
    </Container>
  );
};

const StyledCreatableSelect = chakra(CreatableSelect, {});
