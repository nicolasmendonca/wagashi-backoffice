import React from 'react';
import produce from 'immer';
import {loadIngredients, LoadIngredientsService, loadRecipes, LoadRecipesService} from '@wagashi-backoffice/core';
import {SimpleGrid, List, ListItem, Button, Flex, Editable, EditableInput, EditablePreview, Spinner, Box} from '@chakra-ui/react';
import {RiSubtractFill, RiAddFill} from 'react-icons/ri';
import useSWR from 'swr';

interface IIngredientsCalculatorProps {
  loadRecipesService: LoadRecipesService;
  loadIngredientsService: LoadIngredientsService;
}

const IngredientsCalculator: React.FC<IIngredientsCalculatorProps> = ({loadRecipesService, loadIngredientsService}) => {
  const ingredientSummaryRef = React.useRef<Record<string, number>>({});
  const [recipesCount, setRecipesCount] = React.useState<Record<string, string>>({});
  const {data: recipes} = useSWR('recipes', () => loadRecipes(loadRecipesService));
  const {data: ingredients} = useSWR('ingredients', () => loadIngredients(loadIngredientsService));

  React.useEffect(() => {
    // TODO update ingredient summary ref after each update
  }, [recipesCount, recipes, ingredients]);

  const handleRecipeCountChange = (ingredientId: string, quantity: string) => {
    setRecipesCount(
      produce(recipesCount, (recipesCountDraft) => {
        recipesCountDraft[ingredientId] = quantity;
      })
    );
  };

  const handleRecipeCountAdd = (ingredientId: string, incrementBy: number) => {
    setRecipesCount(
      produce(recipesCount, (recipesCountDraft) => {
        recipesCountDraft[ingredientId] = (Number(recipesCountDraft[ingredientId] || '0') + incrementBy).toString();
      })
    );
  };

  return [recipes, ingredients].includes(undefined) ? (
    <Flex width="full" alignItems="center" justifyContent="center" height="container.sm">
      <Spinner size="xl" color="pink" thickness="6px" />
    </Flex>
  ) : (
    <SimpleGrid columns={2} gap={8}>
      <List borderRadius="md" borderColor="pink" borderWidth="1px">
        {recipes.map((recipe, index) => {
          const recipeCount = recipesCount[recipe.id];
          return (
            <ListItem key={recipe.id} bg={index % 2 == 0 ? 'pink.200' : 'pink.100'} p="4" borderColor="pink" borderBottomWidth="1px">
              <Flex alignItems="center" justifyContent="space-between">
                <span>{recipe.name}</span>
                <Flex alignItems="center" justifyContent="center">
                  <Button size="sm" variant="ghost" colorScheme="pink" onClick={() => handleRecipeCountAdd(recipe.id, -1)}>
                    <RiSubtractFill />
                  </Button>
                  <Editable value={recipeCount || '0'} width="12" textAlign="center" onChange={(value) => handleRecipeCountChange(recipe.id, value)}>
                    <EditablePreview />
                    <EditableInput type="number" />
                  </Editable>
                  <Button size="sm" variant="ghost" colorScheme="pink" onClick={() => handleRecipeCountAdd(recipe.id, 1)}>
                    <RiAddFill />
                  </Button>
                </Flex>
              </Flex>
            </ListItem>
          );
        })}
      </List>
      <Box bgColor="pink.200">
        <List>
          {ingredients.map((ingredient) => (
            <ListItem>
              {ingredient.name} ({getIngredientSum(ingredientId)})
            </ListItem>
          ))}
        </List>
      </Box>
    </SimpleGrid>
  );
};

export default IngredientsCalculator;
