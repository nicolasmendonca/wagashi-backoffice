import React from 'react';
import {deleteRecipe, IngredientWithId, loadIngredients, loadRecipes, Recipe, RecipeWithId} from '@wagashi-backoffice/core';
import useSWR from 'swr';
import produce from 'immer';
import {RiPencilFill, RiDeleteBin5Fill} from 'react-icons/ri';
import {Box, Button, Flex, Text, Grid, GridItem, List, ListItem, Modal, ModalCloseButton, ModalContent, ModalOverlay, Spinner} from '@chakra-ui/react';
import {EditRecipeBox} from 'components/Recipes/EditRecipeBox';
import {useRecipeEditorServices, RecipeEditorServiceProvider} from 'context/RecipeEditorServiceProvider';

export function RecipeEditor() {
  const {loadRecipesService, loadIngredientsService, deleteRecipeService} = useRecipeEditorServices();
  const [activeRecipeId, setActiveRecipeId] = React.useState<string | undefined>(undefined);
  const {data: recipes, mutate: mutateRecipes} = useSWR<RecipeWithId[]>('recipes', () => loadRecipes(loadRecipesService));
  const {data: ingredientList} = useSWR<IngredientWithId[]>('ingredients', () => loadIngredients(loadIngredientsService));
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const resetEditRecipeModal = () => {
    setIsModalOpen(false);
    setActiveRecipeId(undefined);
  };

  const handleRecipeCreate = (recipe: RecipeWithId) => {
    mutateRecipes(
      produce(recipes, (recipeDraft) => {
        recipeDraft?.push(recipe);
      }),
      false
    );
    resetEditRecipeModal();
  };

  const handleRecipeUpdate = (updatedRecipe: RecipeWithId) => {
    mutateRecipes(
      produce(recipes, (recipeDraft) => {
        if (recipeDraft) {
          const updatedRecipeIndex = recipeDraft.findIndex((recipe) => recipe.id === updatedRecipe.id);
          if (recipeDraft[updatedRecipeIndex]) {
            recipeDraft[updatedRecipeIndex] = updatedRecipe;
          } else {
            console.error('Not found', recipes, updatedRecipe);
          }
        }
      }),
      false
    );
    resetEditRecipeModal();
  };

  const handleDeleteRecipeClicked = async (recipeId: string) => {
    const deletedRecipeIndex = recipes!.findIndex((recipe) => recipe.id === recipeId);
    if (deletedRecipeIndex === -1 || !confirm(`Deseas eliminar la receta de ${recipes![deletedRecipeIndex].name}?`)) {
      return;
    }
    mutateRecipes(
      async (recipes) =>
        produce(recipes, async (recipesDraft) => {
          const deletedRecipeIndex = recipesDraft!.findIndex((recipe) => recipe.id === recipeId);
          if (deletedRecipeIndex === -1) return;
          recipesDraft!.splice(deletedRecipeIndex, 1);
        }),
      false
    );
    await deleteRecipe(deleteRecipeService, recipeId);
  };

  const handleEditRecipeClicked = async (recipeId: string) => {
    setActiveRecipeId(recipeId);
    setIsModalOpen(true);
  };

  const handleModalClosed = () => {
    setIsModalOpen(false);
    setActiveRecipeId(undefined);
  };

  return recipes !== undefined && ingredientList !== undefined ? (
    <React.Fragment>
      <Box textAlign="right">
        <Button colorScheme="pink" onClick={() => setIsModalOpen(true)} right="0">
          Agregar Receta
        </Button>
      </Box>
      <Grid templateColumns={['1fr', '1fr', 'repeat(3, 1fr)']} my={8} gap={4}>
        {recipes!.map((recipe) => {
          return (
            <GridItem backgroundColor="pink.100" key={recipe.id} boxShadow="md">
              <Flex p={4} backgroundColor="pink.300" borderTopRadius="md" flexDirection="row" justifyContent="space-between" alignItems="center">
                <Text fontWeight="bold" color="white" verticalAlign="middle" wordBreak="break-word">
                  {recipe.name}
                </Text>
                <Box>
                  <Button variant="ghost" colorScheme="pink" onClick={() => handleEditRecipeClicked(recipe.id)}>
                    <RiPencilFill />
                  </Button>
                  <Button variant="ghost" colorScheme="pink" onClick={() => handleDeleteRecipeClicked(recipe.id)}>
                    <RiDeleteBin5Fill />
                  </Button>
                </Box>
              </Flex>
              <Box minHeight="300px" p={4} borderBottomRadius="md">
                <List>
                  {recipe.ingredients.map((ingredient) => {
                    const ingredientName = ingredientList.find((ingredientItem) => ingredientItem.id === ingredient.id)?.name;
                    return (
                      <ListItem key={ingredient.id} display="flex" justifyContent="space-between" pb={2}>
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
          <EditRecipeBox editRecipeId={activeRecipeId} onRecipeCreate={handleRecipeCreate} onRecipeUpdate={handleRecipeUpdate} />
        </ModalContent>
      </Modal>
    </React.Fragment>
  ) : (
    <Flex width="full" alignItems="center" justifyContent="center" height="container.sm">
      <Spinner size="xl" color="pink" thickness="6px" />
    </Flex>
  );
}

export {RecipeEditorServiceProvider};
