import { ColumnModel, findOneById } from '~/models/column.model'
import { BoardModel } from '~/models/board.model'
import { CardModel } from '~/models/card.model'
const createNew = async (data) => {
  try {
    // transaction mongodb
    const createdColumn = await ColumnModel.createNew(data)

    const getNewColumn = await ColumnModel.findOneById(createdColumn.insertedId.toString())
    // sửa lỗi undifined khi dùng hàm sort bên FE
    getNewColumn.cards = []
    // update columnOrder Array in board collection
    const updateBoard = await BoardModel.pushColumnOrder(getNewColumn.boardId.toString(), getNewColumn._id.toString())
    console.log(updateBoard)

    return getNewColumn
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
    // if(updateData.cards) delete updateData.cards

    const updatedColumn = await ColumnModel.update(id, updateData)

    if (updatedColumn._destroy) {
      // delete many cards in this column
      CardModel.deleteMany(updatedColumn.cardOrder)
    }
    return updatedColumn
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

export const ColumnService = { createNew, update }