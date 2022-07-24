import { CardModel } from '~/models/card.model'
import { ColumnModel } from '~/models/column.model'
const createNew = async (data) => {
  try {
    // transaction mongodb
    const newCard = await CardModel.createNew(data)
    // update columnOrder Array in board collection
    const updateColumn = await ColumnModel.pushCardOrder(newCard.columnId.toString(), newCard.insertedId.toString())
    console.log(updateColumn)
    return newCard
    // const result = await CardModel.createNew(data)
    // return result
  } catch (error) {
    throw new Error(error)
  }
}
export const CardService = { createNew }