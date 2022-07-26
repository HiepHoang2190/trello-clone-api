import Joi, { object } from 'joi';
import { ObjectId } from 'mongodb'
import { getDB } from '~/config/mongodb'
// Define Column collection

const columnColllectionName = 'columns'
const columnCollectionSchema = Joi.object({
  boardId: Joi.string().required(), // also ObjectId when create new
  title: Joi.string().required().min(3).max(20).trim(),
  cardOrder: Joi.array().items(Joi.string()).default([]),
  createdAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
  // abortEarly: hiện đầy đủ lỗi
  return await columnCollectionSchema.validateAsync(data, { abortEarly: false })
}

const findOneById = async (id) => {
  try {
    const result = await getDB().collection(columnColllectionName).findOne({
      _id: ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const createNew = async (data) => {
  try {
    const validatedValue = await validateSchema(data)
    const insertValue = {
      ...validatedValue,
      boardId: ObjectId(validatedValue.boardId)
    }

    const result = await getDB().collection(columnColllectionName).insertOne(insertValue)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * 
 * @param {string} boardId 
 * @param {string} columnId 
 */
const pushCardOrder = async (columnId, cardId) => {
  try {
    const result = await getDB().collection(columnColllectionName).findOneAndUpdate(
      { _id: ObjectId(columnId) },
      { $push: { cardOrder: cardId } },
      { returnDocument:'after' }
    )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (id, data) => {
  try {
    const updateData = {
      ...data,
      boardId:ObjectId(data.boardId)
    }
    const result = await getDB().collection(columnColllectionName).findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: updateData },
      {returnDocument:'after' }
    )
    console.log(result)
    return result.value
  } catch (error) {
    throw new Error(error)
  }
}

export const ColumnModel = {columnColllectionName, createNew, update, pushCardOrder,findOneById }