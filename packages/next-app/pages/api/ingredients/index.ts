import {nanoid} from 'nanoid';
import type {NextApiResponse} from 'next';
import handler, {Request} from '../db';

handler.get('/api/ingredients', async (req: Request, res: NextApiResponse) => {
  const ingredients = await req.db
    .collection('ingredients')
    .find({
      id: {$exists: true},
    })
    .toArray();
  return res.status(200).json(ingredients);
});

handler.post('/api/ingredients', async (req: Request, res: NextApiResponse) => {
  const newIngredient = {
    id: nanoid(),
    ...req.body.ingredient,
  };
  await req.db.collection('ingredients').insertOne(newIngredient);
  return res.status(200).json(newIngredient);
});

handler.delete('/api/ingredients', async (req: Request, res: NextApiResponse) => {
  const deletedIngredientIds = req.body;
  await req.db.collection('ingredients').deleteMany({
    id: {
      $in: deletedIngredientIds,
    },
  });
  // Remove the ingredient from associated recipes
  await req.db.collection('recipes').updateMany(
    {
      ingredients: {
        $elemMatch: {
          id: {
            $in: deletedIngredientIds,
          },
        },
      },
    },
    {
      $pull: {
        ingredients: {
          id: {
            $in: deletedIngredientIds,
          },
        },
      },
    }
  );
  return res.status(200).json(true);
});

export default handler;
