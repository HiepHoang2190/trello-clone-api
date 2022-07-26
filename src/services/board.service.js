import { BoardModel, findOneById } from '~/models/board.model'
import { cloneDeep } from 'lodash'
const createNew = async (data) => {
  try {
    const createdBoard = await BoardModel.createNew(data)
    const getNewBoard = await BoardModel.findOneById(createdBoard.insertedId.toString())
    // push notification
    // do something...
    // transfomr data
    return getNewBoard
  } catch (error) {
    throw new Error(error)
  }
}

const getFullBoard = async (boardId) => {
  try {
    console.log(boardId)
    const board = await BoardModel.getFullBoard(boardId)
    if (!board || !board.columns) {
      throw new Error('Board not found!')
    }
    const transformBoard = cloneDeep(board)
    // Filter deteled columns
    transformBoard.columns =  transformBoard.columns.filter(column => !column._destroy)

    // Add card to each column
    transformBoard.columns.forEach(column => {
      column.cards = transformBoard.cards.filter(c => c.columnId.toString() === column._id.toString())
    })
    // Sort columns by columnOrder, sort cards by cardOrder, this step will pass to frontend DEV
    // Remove cards data from boards
    delete transformBoard.cards
    // console.log(board)
    return transformBoard
  } catch (error) {
    // console.log(error.message)
    throw new Error(error)
  }
}

export const BoardService = { createNew, getFullBoard }