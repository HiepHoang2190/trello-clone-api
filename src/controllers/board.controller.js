import {BoardSerive} from '~/services/board.service'
import { HttpStatusCode } from '~/utilities/constants'
const createNew = async (req, res) => {
  // console.log(req.body)
  try {
    const result = await BoardSerive.createNew(req.body)
    // console.log(result)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    console.log(error)
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

export const BoardController = { createNew }