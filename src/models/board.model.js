import { ObjectId } from 'mongodb'
import Joi from 'joi';
import { getDB } from '~/config/mongodb'
import { ColumnModel } from './column.model'
import { CardModel } from './card.model'
// Define Board collection

const boardColllectionName = 'boards'
const boardCollectionSchema = Joi.object({
  title: Joi.string().required().min(3).max(20).trim(),
  columnOrder: Joi.array().items(Joi.string()).default([]),
  createdAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
  // abortEarly: hiện đầy đủ lỗi
  return await boardCollectionSchema.validateAsync(data, { abortEarly: false })
}

const findOneById = async (id) => {
  try {
    const result = await getDB().collection(boardColllectionName).findOne({
      _id: ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const createNew = async (data) => {
  try {
    const value = await validateSchema(data)
    console.log(value)
    const result = await getDB().collection(boardColllectionName).insertOne(value)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (id, data) => {
  try {
    const updateData = { ...data }
    const result = await getDB().collection(boardColllectionName).findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    console.log(result)
    return result.value
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * 
 * @param {string} boardId 
 * @param {string} columnId 
 */
const pushColumnOrder = async (boardId, columnId) => {
  try {
    const result = await getDB().collection(boardColllectionName).findOneAndUpdate(
      { _id: ObjectId(boardId) },
      { $push: { columnOrder: columnId } },
      { returnDocument: 'after' }
    )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getFullBoard = async (boardId) => {
  try {
    const result = await getDB().collection(boardColllectionName).aggregate([
      {
        $match: {
          _id: ObjectId(boardId),
          _destroy: false
        }
      },
      // add fields để chuyển ObjectId thành string xong truy vấn nếu lúc tạo column và card chưa chuyển
      // boardId và columnId thành ObjectId
      // {
      //   $addFields: {
      //     _id: {
      //       $toString:'$_id'
      //     }
      //   }
      // },
      {
        $lookup: {
          from: ColumnModel.columnColllectionName, //collection name.
          localField: '_id',
          foreignField: 'boardId',
          as: 'columns'
        }
      },
      {
        $lookup: {
          from: CardModel.cardColllectionName, //collection name.
          localField: '_id',
          foreignField: 'boardId',
          as: 'cards'
        }
      }
    ]).toArray()
    // console.log(result)
    return result[0] || {}
  } catch (error) {
    throw new Error(error)
  }
}

export const BoardModel = { createNew, getFullBoard, pushColumnOrder, findOneById, update }