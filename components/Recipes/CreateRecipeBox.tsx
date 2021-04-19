import React, {FormEvent} from 'react';
import produce from 'immer';
import {nanoid} from 'nanoid';
import CreatableSelect from 'react-select/creatable';
import {chakra, Button, Container, FormControl, FormLabel, HStack, Input} from '@chakra-ui/react';
import {Recipe} from 'core/entities/recipe';
import {useApp} from 'context/App';
import useSWR from 'swr';

interface IEditRecipeBoxProps {
  onRecipeSave: (recipe: Recipe) => void;
  editRecipeId?: string;
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

export const CreateRecipeBox: React.FC<IEditRecipeBoxProps> = ({onRecipeSave, editRecipeId}) => {
  const app = useApp();
  const {data: ingredientList = [], revalidate} = useSWR('ingredients', app.loadIngredients);
  const {data: recipeList = []} = useSWR('recipes', app.loadRecipes);
  const [recipeState, setRecipeState] = React.useState<RecipeForm>(() => emptyRecipe);

  React.useEffect(() => {
    if (editRecipeId && ingredientList.length > 0 && recipeList.length > 0) {
      const loadedRecipe = recipeList.find((recipe) => recipe.id === editRecipeId);
      if (!loadedRecipe) {
        throw new Error('Recipe not found');
      }
      setRecipeState({
        name: loadedRecipe.name,
        ingredients: [
          ...loadedRecipe.ingredients.map((ingredient) => {
            return {
              _id: nanoid(),
              ingredientId: ingredient.id,
              quantity: ingredient.quantity.toString(),
            };
          }),
          createEmptyIngredient(),
        ],
      });
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

      // Add empty ingredient if that was the last one
      if (draft.ingredients[draft.ingredients.length - 1].ingredientId !== '') {
        draft.ingredients.push(createEmptyIngredient());
      }
    });
    setRecipeState(updatedRecipe);
  };

  const handleIngredientRemove = (ingredientIndex: number) => {
    const updatedRecipe = produce(recipeState, (draft) => {
      draft.ingredients.splice(ingredientIndex, 1);

      // Add empty ingredient if that was the last one
      if (draft.ingredients.length === 0) {
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
    const recipe: Recipe = {
      name: recipeState.name,
      ingredients: recipeState.ingredients
        .filter((ingredient) => ingredient.ingredientId !== '' || ingredient.quantity !== '')
        .map((ingredient) => {
          return {
            id: ingredient.ingredientId,
            quantity: Number(ingredient.quantity),
          };
        }),
    };

    const savedRecipe = editRecipeId
      ? await app.updateRecipe(editRecipeId, recipe)
      : await app.createRecipe(recipe);
    onRecipeSave(savedRecipe);
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
