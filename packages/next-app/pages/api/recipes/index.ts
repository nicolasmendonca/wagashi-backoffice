import {nanoid} from 'nanoid';
import type { NextApiResponse } from 'next'
import handler, { Request } from '../db';

handler.get('/api/recipes', async (req: Request, res: NextApiResponse) => {
    const recipes = await req.db.collection('recipes').find({
      id: { $exists: true }
    }).toArray();
    return res.status(200).json(recipes);
})

handler.post('/api/recipes', async (req: Request, res: NextApiResponse) => {
  const newRecipe = {
    id: nanoid(),
    ...req.body.recipe
  }
  await req.db.collection('recipes').insertOne(newRecipe)
  return res.status(200).json(newRecipe)
})

export default handler;
