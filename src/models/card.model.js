import Joi from 'joi';
import { ObjectId } from 'mongodb'
import { getDB } from '~/config/mongodb'
// Define Card collection

const cardColllectionName = 'cards'
const cardCollectionSchema = Joi.object({
  boardId: Joi.string().required(),// also ObjectId when create new
  columnId: Joi.string().required(),// also ObjectId when create new
  title: Joi.string().required().min(3).max(30).trim(),
  cover: Joi.string().default(null),
  createdAt: Joi.date().timestamp().default(Date.now()),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false)
})

const validateSchema = async (data) => {
  // abortEarly: hiện đầy đủ lỗi
  return await cardCollectionSchema.validateAsync(data, { abortEarly: false })
}

const findOneById = async (id) => {
  try {
    const result = await getDB().collection(cardColllectionName).findOne({
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
      boardId: ObjectId(validatedValue.boardId),
      columnId: ObjectId(validatedValue.columnId)
    }
    const result = await getDB().collection(cardColllectionName).insertOne(insertValue)

    return result

  } catch (error) {
    throw new Error(error)
  }
}

const update = async (id, data) => {
  try {
    const updateData = { ...data }
    if (data.boardId) {
      updateData.boardId = ObjectId(data.boardId)
    }
    if (data.columnId) {
      updateData.columnId = ObjectId(data.columnId)
    }
    
    const result = await getDB().collection(cardColllectionName).findOneAndUpdate(
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
 * @param {Array of string card id} ids 
 */
const deleteMany = async (ids) => {
  try {
    const transformIds = ids.map(i => ObjectId(i))
    const result = await getDB().collection(cardColllectionName).updateMany(
      { _id: { $in: transformIds } },
      { $set: { _destroy: true } }
    )
    console.log(result)
    return result
  } catch (error) {
    throw new Error(error)
  }
}
export const CardModel = { cardColllectionName, createNew, findOneById, deleteMany, update }