import React, {FormEvent} from 'react';
import produce from 'immer';
import {nanoid} from 'nanoid';
import CreatableSelect from 'react-select/creatable';
import {chakra, Button, Container, FormControl, FormLabel, HStack, Input} from '@chakra-ui/react';
import {Recipe} from 'core/entities/recipe';
import {useApp} from 'context/App';
import useSWR from 'swr';

interface IEditRecipeBoxProps {
  recipe?: Recipe;
  onRecipeSave: (recipe: Recipe) => void;
}

interface RecipeForm {
  name: string;
  ingredients: Array<{
    _id: string;
    ingredientId: string;
    quantity: string;
  }>;
}

const createEmptyIngredient = () => {
  return {
    _id: nanoid(),
    ingredientId: '',
    quantity: '',
  };
};

const emptyRecipe: RecipeForm = {
  name: '',
  ingredients: [createEmptyIngredient()],
};

export const EditRecipeBox: React.FC<IEditRecipeBoxProps> = ({onRecipeSave}) => {
  const app = useApp();
  const {data: ingredientList = [], error, revalidate} = useSWR('ingredients', app.getIngredients);
  const [recipeState, setRecipeState] = React.useState<RecipeForm>(emptyRecipe);

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
      if (draft.ingredients[draft.ingredients.length - 1].ingredientId !== '') {
        draft.ingredients.push(createEmptyIngredient());
      }
    });
    setRecipeState(updatedRecipe);
  };

  const handleIngredientCreate = async (ingredientIndex: number, name: string) => {
    const ingredient = await app.createIngredient({name});
    console.log('created ingredient', ingredient);
    console.log('ingredientList', ingredientList);
    await revalidate();
    console.warn('re-rendered. ingredientList:', ingredientList, ingredientIndex);
    handleIngredientChange(ingredientIndex, ingredient.id);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  if (ingredientList === null) {
    return <p>Loading</p>;
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
                    : {label: ''}
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
                onChange={({value: ingredientId}) => handleIngredientChange(index, ingredientId)}
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

const StyledCreatableSelect = chakra(CreatableSelect, {});
