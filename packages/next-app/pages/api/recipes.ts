import { RecipeWithId } from '@wagashi-backoffice/core'
import type { NextApiRequest, NextApiResponse } from 'next'

const recipes: RecipeWithId[] = []

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return res.status(200).json(recipes);
  } else if (req.method === 'POST') {
    recipes.push(...req.body.recipes)
    return res.status(200).json(recipes)
  }

  throw new Error('Method not allowed')
}
