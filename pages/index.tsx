import React from 'react';
import {PageWrapper} from 'components/PageWrapper';
import {Button, Modal, ModalCloseButton, ModalContent, ModalOverlay} from '@chakra-ui/react';
import produce from 'immer';
import {EditRecipeBox} from 'components/Recipes';
import {Recipe} from 'core/entities/recipe';
import {saveIngredients} from 'core/useCases/ingredient';
import {createSaveIngredientsService} from '../core/services/ingredientsService';
import {ingredientsLocalStorageRepository} from '../repositories/ingredientRepository';

export default function Home() {
  const [recipes, setRecipes] = React.useState<Recipe[]>([]);
  const [ingredientList, setIngredientList] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [activeRecipe, setActiveRecipe] = React.useState<Recipe>(undefined);

  const handleRecipeSave = (recipe: Recipe) => {
    setRecipes(
      produce(recipes, (draft) => {
        draft.push(recipe);
      })
    );
    setIsModalOpen(false);
    setActiveRecipe(undefined);
  };

  return (
    <PageWrapper title="Recetas">
      {/* Add recipe modal */}
      <Button colorScheme="pink" onClick={() => setIsModalOpen(true)}>
        Agregar Receta
      </Button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <EditRecipeBox recipe={activeRecipe} onRecipeSave={handleRecipeSave} />
        </ModalContent>
      </Modal>
    </PageWrapper>
  );
}
