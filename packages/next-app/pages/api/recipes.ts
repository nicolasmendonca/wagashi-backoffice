import {nanoid} from 'nanoid';
import { RecipeWithId } from '@wagashi-backoffice/core'
import type { NextApiRequest, NextApiResponse } from 'next'

let recipes: RecipeWithId[] = []

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return res.status(200).json(recipes);
  } else if (req.method === 'POST') {
    return res.status(200).json({
      id: nanoid(),
      ...req.body.recipe
    })
  }

  throw new Error('Method not allowed')
}
