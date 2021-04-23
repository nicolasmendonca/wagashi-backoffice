import React from 'react';
import {deleteRecipe, loadIngredients, loadRecipes} from '@wagashi-backoffice/core';
import useSWR from 'swr';
import {RiPencilFill, RiDeleteBin5Fill} from 'react-icons/ri';
import {
  Box,
  Button,
  Flex,
  Text,
  Grid,
  GridItem,
  List,
  ListItem,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ThemeProvider,
  ChakraProvider,
} from '@chakra-ui/react';
import {PageWrapper} from './components/PageWrapper';
import {EditRecipeBox} from 'components/Recipes';
import {
  useRecipeEditorServices,
  RecipeEditorServiceProvider,
} from './context/RecipeEditorServiceProvider';
import {theme} from './theme';

export function RecipeEditor() {
  const {
    loadRecipesService,
    loadIngredientsService,
    deleteRecipeService,
  } = useRecipeEditorServices();
  const [activeRecipeId, setActiveRecipeId] = React.useState<string | undefined>(undefined);
  const {data: recipes, revalidate} = useSWR('recipes', () => loadRecipes(loadRecipesService));
  const {data: ingredientList} = useSWR('ingredients', () =>
    loadIngredients(loadIngredientsService)
  );
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const handleRecipeSave = async () => {
    setIsModalOpen(false);
    await revalidate();
  };

  const handleDeleteRecipeClicked = async (recipeId: string) => {
    await deleteRecipe(deleteRecipeService, recipeId);
    revalidate();
  };

  const handleEditRecipeClicked = async (recipeId: string) => {
    setActiveRecipeId(recipeId);
    setIsModalOpen(true);
  };

  const handleModalClosed = () => {
    setIsModalOpen(false);
    setActiveRecipeId(undefined);
  };

  if (!recipes || !ingredientList) {
    return <p>Loading</p>;
  }

  return (
    <ChakraProvider>
      <ThemeProvider theme={theme}>
        <PageWrapper title="Recetas">
          {/* Add recipe modal */}
          <Box textAlign="right">
            <Button colorScheme="pink" onClick={() => setIsModalOpen(true)} right="0">
              Agregar Receta
            </Button>
          </Box>
          <Grid templateColumns={['1fr', '1fr', 'repeat(3, 1fr)']} my={8} gap={4}>
            {recipes.map((recipe) => {
              return (
                <GridItem backgroundColor="pink.200" key={recipe.id}>
                  <Flex
                    p={4}
                    backgroundColor="pink.400"
                    borderTopRadius="md"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text
                      fontWeight="bold"
                      color="white"
                      verticalAlign="middle"
                      wordBreak="break-word"
                    >
                      {recipe.name}
                    </Text>
                    <Box>
                      <Button
                        variant="ghost"
                        colorScheme="pink"
                        onClick={() => handleEditRecipeClicked(recipe.id)}
                      >
                        <RiPencilFill />
                      </Button>
                      <Button
                        variant="ghost"
                        colorScheme="pink"
                        onClick={() => handleDeleteRecipeClicked(recipe.id)}
                      >
                        <RiDeleteBin5Fill />
                      </Button>
                    </Box>
                  </Flex>
                  <Box minHeight="300px" p={4} borderBottomRadius="md">
                    <List>
                      {recipe.ingredients.map((ingredient) => {
                        const ingredientName = ingredientList.find(
                          (ingredientItem) => ingredientItem.id === ingredient.id
                        )?.name;
                        return (
                          <ListItem
                            key={ingredient.id}
                            display="flex"
                            justifyContent="space-between"
                            pb={2}
                          >
                            <Text>{ingredientName}</Text>
                            <Text color="gray.500" fontSize="sm">
                              ({ingredient.quantity})
                            </Text>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Box>
                </GridItem>
              );
            })}
          </Grid>
          <Modal isOpen={isModalOpen} onClose={handleModalClosed} size="3xl">
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton />
              <EditRecipeBox editRecipeId={activeRecipeId} onRecipeSave={handleRecipeSave} />
            </ModalContent>
          </Modal>
        </PageWrapper>
      </ThemeProvider>
    </ChakraProvider>
  );
}

export {RecipeEditorServiceProvider};