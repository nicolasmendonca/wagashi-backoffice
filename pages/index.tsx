import React from 'react';
import {PageWrapper} from 'components/PageWrapper';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  List,
  ListItem,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react';
import {EditRecipeBox} from 'components/Recipes';
import {useApp} from '../context/App';
import {RiPencilFill, RiDeleteBin5Fill} from 'react-icons/ri';
import useSWR from 'swr';

export default function Home() {
  const {loadRecipes, loadIngredients, deleteRecipe} = useApp();
  const [activeRecipeId, setActiveRecipeId] = React.useState<string>(undefined);
  const {data: recipes, revalidate} = useSWR('recipes', loadRecipes);
  const {data: ingredientList} = useSWR('ingredients', loadIngredients);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const handleRecipeSave = async () => {
    setIsModalOpen(false);
    await revalidate();
  };

  const handleDeleteRecipeClicked = async (recipeId: string) => {
    await deleteRecipe(recipeId);
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
                <Text fontWeight="bold" color="white" verticalAlign="middle" wordBreak="break-word">
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
  );
}
