import jwt from 'jsonwebtoken'
import ApiError from '../utils/ApiError.js'
import { fetchUserById } from '../auth/auth.service.js'

const authenticate = async (request, response, next) => {
  try {
    const authorizationHeader = request.headers.authorization

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Login required')
    }

    const accessToken = authorizationHeader.split(' ')[1]
    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET)

    request.user = await fetchUserById(decodedToken.userId)
    next()
  } catch (error) {
    next(error)
  }
}

export default authenticate