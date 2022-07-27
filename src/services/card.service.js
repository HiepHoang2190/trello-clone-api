import { CardModel, findOneById } from '~/models/card.model'
import { ColumnModel } from '~/models/column.model'

const createNew = async (data) => {
  try {
    // transaction mongodb
    const createdCard = await CardModel.createNew(data)
    const getNewCard = await CardModel.findOneById(createdCard.insertedId.toString())
    // update columnOrder Array in board collection
    const updateColumn = await ColumnModel.pushCardOrder(getNewCard.columnId.toString(), getNewCard._id.toString())
    console.log(updateColumn)
    return getNewCard

  } catch (error) {
    throw new Error(error)
  }
}

const update = async (id, data) => {
  try {
    const updateData = {
      ...data,
      updatedAt: Date.now()
    }
    if (updateData._id) delete updateData._id
    const updatedCard = await CardModel.update(id, updateData)

    return updatedCard
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}
export const CardService = { createNew, update }