import React from 'react';
import {RecipeEditor} from './components/Recipes/RecipeEditor';
import {RecipeEditorServiceProvider, RecipeEditorServices} from './context';

interface RecipeEditorWithContextProps {
  services: RecipeEditorServices;
}

const RecipeEditorWithContext: React.FC<RecipeEditorWithContextProps> = ({services}) => {
  return (
    <RecipeEditorServiceProvider value={services}>
      <RecipeEditor />
    </RecipeEditorServiceProvider>
  );
};

export {RecipeEditorWithContext as RecipeEditor};
