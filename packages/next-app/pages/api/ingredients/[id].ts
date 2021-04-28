import type {NextApiResponse} from 'next';
import handler, {Request} from '../db';

handler.put('/api/ingredients/:id', async (req: Request, res: NextApiResponse) => {
  await req.db.collection('ingredients').findOneAndReplace(
    {
      id: req.query.id,
    },
    req.body
  );
  const updatedIngredients = await req.db.collection('ingredients').find({});
  return res.status(200).json(updatedIngredients);
});
