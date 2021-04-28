import {Button, IconButton, Input, Box, Flex, Spinner, Table, Tbody, Td, Th, Thead, Tr} from '@chakra-ui/react';
import {
  deleteIngredient,
  DeleteIngredientsService,
  IngredientWithId,
  loadIngredients,
  LoadIngredientsService,
  updateIngredient,
  UpdateIngredientService,
} from '@wagashi-backoffice/core';
import produce from 'immer';
import React, {ChangeEvent, FormEvent} from 'react';
import {IoMdTrash} from 'react-icons/io';
import useSWR from 'swr';

interface IngredientsProps {
  loadIngredientsService: LoadIngredientsService;
  updateIngredientService: UpdateIngredientService;
  deleteIngredientsService: DeleteIngredientsService;
}

export const Ingredients: React.FC<IngredientsProps> = ({loadIngredientsService, updateIngredientService, deleteIngredientsService}) => {
  const {data: ingredients, mutate, revalidate} = useSWR('ingredients', () => loadIngredients(loadIngredientsService));
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState<boolean>(false);
  const updatedIngredients = React.useRef<Record<string, IngredientWithId>>({});
  const deletedIngredientIds = React.useRef<string[]>([]);

  const handleIngredientChange = async (e: ChangeEvent<HTMLInputElement>, ingredientIndex: number) => {
    const {name, value} = e.target;
    mutate(
      (ingredientList) =>
        produce(ingredientList, (ingredientsDraft) => {
          ingredientsDraft[ingredientIndex][name] = `${value}`;
          updatedIngredients.current[ingredientList[ingredientIndex].id] = ingredientList[ingredientIndex];
          setHasUnsavedChanges(true);
          return ingredientsDraft;
        }),
      false
    );
  };

  const handleSaveChanges = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const deletedIngredientPromises = deleteIngredient(deleteIngredientsService, deletedIngredientIds.current);
    const updatedIngredientPromises = Object.entries(updatedIngredients.current)
      .filter(([ingredientId]) => !deletedIngredientIds.current.includes(ingredientId)) // filter out deleted ingredients
      .map(([ingredientId, updatedIngredient]) => updateIngredient(updateIngredientService, ingredientId, updatedIngredient));
    try {
      await deletedIngredientPromises;
      await Promise.all(updatedIngredientPromises);
      updatedIngredients.current = {};
      deletedIngredientIds.current = [];
      await revalidate();
    } catch (e) {
      alert(e.message);
    }
    setHasUnsavedChanges(false);
  };

  const handleDeleteIngredient = (ingredientIndex: number) => {
    const ingredient = ingredients[ingredientIndex];
    if (!ingredient) return;
    deletedIngredientIds.current.push(ingredient.id);
    mutate(
      produce(ingredients, (ingredientsDraft) => {
        ingredientsDraft.splice(ingredientIndex, 1);
      }),
      false
    );
    setHasUnsavedChanges(true);
  };

  return ingredients ? (
    <form onSubmit={handleSaveChanges}>
      <Box textAlign="right" mb={6}>
        <Button
          mr={4}
          colorScheme="pink"
          onClick={(e) => {
            e.preventDefault();
            setHasUnsavedChanges(false);
            updatedIngredients.current = {};
            deletedIngredientIds.current = [];
            revalidate();
          }}
          disabled={!hasUnsavedChanges}
          variant="outline"
          right="0"
          type="button"
        >
          Descartar Cambios
        </Button>
        <Button colorScheme="pink" type="submit" disabled={!hasUnsavedChanges} right="0">
          Guardar Cambios
        </Button>
      </Box>
      <Table colorScheme="pink" variant="striped" bgColor="pink.200" borderRadius="md">
        <Thead bg="pink.300">
          <Tr>
            <Th>Nombre</Th>
            <Th>Cantidad</Th>
            <Th>Precio</Th>
            <Th>Borrar</Th>
          </Tr>
        </Thead>
        <Tbody>
          {ingredients.map((ingredient, index) => (
            <Tr key={ingredient.id}>
              <Td>
                <Input bg="white" placeholder="Chocolate" name="name" value={ingredient.name} onChange={(e) => handleIngredientChange(e, index)} type="text" />
              </Td>
              <Td>
                <Input
                  bg="white"
                  placeholder="1000"
                  name="quantity"
                  value={ingredient.quantity || ''}
                  onChange={(e) => handleIngredientChange(e, index)}
                  type="number"
                />
              </Td>
              <Td>
                <Input
                  bg="white"
                  placeholder="72.50"
                  name="price"
                  value={ingredient.price || ''}
                  onChange={(e) => handleIngredientChange(e, index)}
                  type="number"
                />
              </Td>
              <Td>
                <IconButton
                  icon={<IoMdTrash />}
                  variant="ghost"
                  colorScheme="red"
                  aria-label={`Eliminar ${ingredient.name}`}
                  onClick={() => handleDeleteIngredient(index)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </form>
  ) : (
    <Flex width="full" alignItems="center" justifyContent="center" height="container.sm">
      <Spinner size="xl" color="pink" thickness="6px" />
    </Flex>
  );
};
