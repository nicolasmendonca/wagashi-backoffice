import { nanoid } from 'nanoid'
import { IngredientWithId } from '@wagashi-backoffice/core'
import type { NextApiRequest, NextApiResponse } from 'next'

const ingredients: IngredientWithId[] = []

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return res.status(200).json(ingredients);
  } else if (req.method === 'POST') {
    ingredients.push({
        id: nanoid(),
        ...req.body.ingredient
    })
    return res.status(200).json(ingredients);
  }

  throw new Error('Method not allowed')
}
