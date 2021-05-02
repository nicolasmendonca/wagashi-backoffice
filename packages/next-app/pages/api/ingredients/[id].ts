import type {NextApiResponse} from 'next';
import handler, {Request} from '../db';

handler.put('/api/ingredients/:id', async (req: Request, res: NextApiResponse) => {
  await req.db.collection('ingredients').findOneAndReplace(
    {
      id: req.query.id,
    },
    req.body
  );
  return res.status(200);
});
