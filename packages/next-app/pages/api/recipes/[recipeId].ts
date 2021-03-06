import type {NextApiResponse} from 'next';
import handler, {Request} from '../db';

handler.put('/api/recipes/:recipeId', async (req: Request, res: NextApiResponse) => {
  const {recipeId} = req.query;
  await req.db.collection('recipes').updateOne({id: recipeId}, {$set: req.body.recipe}, {upsert: true});
  return res.status(200).json({id: recipeId, ...req.body.recipe});
});

handler.delete('/api/recipes/:recipeId', async (req: Request, res: NextApiResponse) => {
  const {recipeId} = req.query;
  await req.db.collection('recipes').deleteOne({id: {$eq: recipeId}});
  return res.status(200);
});

export default handler;
