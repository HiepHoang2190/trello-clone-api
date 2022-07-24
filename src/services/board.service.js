import { BoardModel,findOneById } from '~/models/board.model'

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
    if(!board || !board.columns) {
      throw new Error('Board not found!')
    }
    // Add card to each column
    board.columns.forEach(column => {
      column.cards = board.cards.filter(c => c.columnId.toString() === column._id.toString())
    })
    // Sort columns by columnOrder, sort cards by cardOrder, this step will pass to frontend DEV
    // Remove cards data from boards
    delete board.cards
    // console.log(board)
    return board
  } catch (error) {
    // console.log(error.message)
    throw new Error(error)
  }
}

export const BoardService = { createNew, getFullBoard }