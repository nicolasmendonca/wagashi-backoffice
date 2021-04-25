import React from 'react';
import produce from 'immer';
import {
  calculateIngredientQuantities,
  loadIngredients,
  LoadIngredientsService,
  loadRecipes,
  LoadRecipesService,
  RecipeIngredientSummary,
} from '@wagashi-backoffice/core';
import {
  SimpleGrid,
  List,
  ListItem,
  Button,
  Flex,
  Editable,
  EditableInput,
  EditablePreview,
  Spinner,
  Box,
  Heading,
  Table,
  Thead,
  Th,
  Tr,
  Tbody,
  Td,
} from '@chakra-ui/react';
import {RiSubtractFill, RiAddFill} from 'react-icons/ri';
import useSWR from 'swr';

interface IIngredientsCalculatorProps {
  loadRecipesService: LoadRecipesService;
  loadIngredientsService: LoadIngredientsService;
}

interface IRecipeIngredientSummaryWithName extends RecipeIngredientSummary {
  name: string;
}

const useIngredientsCalculator = ({loadRecipesService, loadIngredientsService}: IIngredientsCalculatorProps) => {
  const [recipesCount, setRecipesCount] = React.useState<Record<string, string>>({});
  const {data: recipes} = useSWR('recipes', () => loadRecipes(loadRecipesService));
  const {data: ingredients} = useSWR('ingredients', () => loadIngredients(loadIngredientsService));

  const getIngredientSummary = (): IRecipeIngredientSummaryWithName[] => {
    if (!recipes || !ingredients) return [];
    // Repeated array of recipes to calculate
    const addedRecipes = Object.entries(recipesCount)
      .map(([recipeId, recipeRepetitions]) => {
        const recipe = recipes.find((recipe) => recipe.id === recipeId);
        return Array(Number(recipeRepetitions))
          .fill(null)
          .map(() => recipe);
      })
      .flat();
    return calculateIngredientQuantities(addedRecipes).map((ingredientSummary) => {
      const ingredientName = ingredients.find((ingredient) => ingredient.id === ingredientSummary.id).name;
      return {
        ...ingredientSummary,
        name: ingredientName,
      };
    });
  };
  const ingredientSummary = getIngredientSummary();
  return {
    ingredientSummary,
    recipes,
    ingredients,
    recipesCount,
    changeRecipeQuantity: (recipeId: string, newQuantity: string) => {
      setRecipesCount(
        produce(recipesCount, (recipesCountDraft) => {
          recipesCountDraft[recipeId] = newQuantity;
        })
      );
    },
  };
};

const IngredientsCalculator: React.FC<IIngredientsCalculatorProps> = ({loadRecipesService, loadIngredientsService}) => {
  const {recipes, ingredients, ingredientSummary, recipesCount, changeRecipeQuantity} = useIngredientsCalculator({loadIngredientsService, loadRecipesService});

  console.log(ingredientSummary);

  const handleRecipeCountAdd = (recipeId: string, incrementBy: number) => {
    changeRecipeQuantity(recipeId, (Number(recipesCount[recipeId] || '0') + incrementBy).toString());
  };

  return [recipes, ingredients].includes(undefined) ? (
    <Flex width="full" alignItems="center" justifyContent="center" height="container.sm">
      <Spinner size="xl" color="pink" thickness="6px" />
    </Flex>
  ) : (
    <SimpleGrid columns={2} gap={8}>
      <Table p={4} variant="striped" colorScheme="pink" bgColor="pink.200">
        <Thead>
          <Tr>
            <Th>Receta</Th>
            <Th textAlign="right" width="180px">
              Cantidad
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {recipes.map((recipe, index) => {
            const recipeCount = recipesCount[recipe.id];
            return (
              <Tr key={recipe.id} p="4">
                <Td wordBreak="break-word">{recipe.name}</Td>
                <Td textAlign="right">
                  <Button size="sm" variant="ghost" colorScheme="pink" onClick={() => handleRecipeCountAdd(recipe.id, -1)} display="inline-block">
                    <RiSubtractFill />
                  </Button>
                  <Editable
                    value={recipeCount || '0'}
                    textAlign="center"
                    onChange={(value) => changeRecipeQuantity(recipe.id, value)}
                    display="inline-block"
                    width="12"
                  >
                    <EditablePreview />
                    <EditableInput type="number" />
                  </Editable>
                  <Button size="sm" variant="ghost" colorScheme="pink" onClick={() => handleRecipeCountAdd(recipe.id, 1)} display="inline-block">
                    <RiAddFill />
                  </Button>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <Box borderColor="pink.200" borderWidth="1px" borderRadius="md">
        <Box bgColor="pink.300">
          <Heading as="h2" size="md" p={4} height="65px">
            Ingredientes Necesarios
          </Heading>
        </Box>
        <Table p={4} variant="striped" colorScheme="pink" bgColor="pink.200">
          <Thead>
            <Tr>
              <Th>Ingrediente</Th>
              <Th>Cantidad</Th>
            </Tr>
          </Thead>
          <Tbody>
            {ingredientSummary.map((ingredient) => (
              <Tr key={ingredient.id}>
                <Td>{ingredient.name}</Td>
                <Td>{ingredient.total}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </SimpleGrid>
  );
};

export default IngredientsCalculator;
