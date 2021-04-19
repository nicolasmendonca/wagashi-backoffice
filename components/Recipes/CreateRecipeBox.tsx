import React, {FormEvent} from 'react';
import produce from 'immer';
import {nanoid} from 'nanoid';
import CreatableSelect from 'react-select/creatable';
import {chakra, Button, Container, FormControl, FormLabel, HStack, Input} from '@chakra-ui/react';
import {Recipe} from 'core/entities/recipe';
import {useApp} from 'context/App';
import useSWR from 'swr';

interface IEditRecipeBoxProps {
  onRecipeCreate: (recipe: Recipe) => void;
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

export const CreateRecipeBox: React.FC<IEditRecipeBoxProps> = ({onRecipeCreate}) => {
  const app = useApp();
  const {data: ingredientList = [], error, revalidate} = useSWR('ingredients', app.loadIngredients);
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
    await revalidate();
    handleIngredientChange(ingredientIndex, ingredient.id);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const createdRecipe = await app.createRecipe({
      name: recipeState.name,
      ingredients: recipeState.ingredients
        .filter((ingredient) => ingredient.ingredientId !== '' || ingredient.quantity !== '')
        .map((ingredient) => {
          return {
            id: ingredient.ingredientId,
            quantity: Number(ingredient.quantity),
          };
        }),
    });
    onRecipeCreate(createdRecipe);
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
