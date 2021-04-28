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
  await req.db.collection('ingredients').deleteMany({
    id: {
      $in: req.body,
    },
  });
  const updatedIngredients = await req.db.collection('ingredients').find({});
  return res.status(200).json(updatedIngredients);
});

export default handler;
