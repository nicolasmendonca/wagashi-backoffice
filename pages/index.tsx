import React from 'react';
import {PageWrapper} from 'components/PageWrapper';
import {
  Box,
  Button,
  Grid,
  GridItem,
  List,
  ListItem,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import {CreateRecipeBox} from 'components/Recipes';
import {useApp} from '../context/App';
import useSWR from 'swr';

export default function Home() {
  const {loadRecipes, loadIngredients} = useApp();
  const {data: recipes, revalidate} = useSWR('recipes', loadRecipes);
  const {data: ingredientList} = useSWR('ingredients', loadIngredients);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const handleRecipeSave = async () => {
    setIsModalOpen(false);
    await revalidate();
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
      <Grid templateColumns="repeat(2, 1fr)" my={8} gap={4}>
        {recipes.map((recipe) => {
          return (
            <GridItem backgroundColor="pink.200" key={recipe.id}>
              <Box backgroundColor="pink.400" borderTopRadius="md">
                <Text fontWeight="bold" color="white" p={4}>
                  {recipe.name}
                </Text>
              </Box>
              <Box minHeight="300px" p={4} borderBottomRadius="md">
                <List>
                  {recipe.ingredients.map((ingredient) => {
                    const ingredientName = ingredientList.find(
                      (ingredientItem) => ingredientItem.id === ingredient.id
                    )?.name;
                    return (
                      <ListItem key={ingredient.id}>
                        {ingredientName} ({ingredient.quantity})
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            </GridItem>
          );
        })}
      </Grid>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <CreateRecipeBox onRecipeCreate={handleRecipeSave} />
        </ModalContent>
      </Modal>
    </PageWrapper>
  );
}
