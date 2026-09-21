import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import User from './user.model.js'
import ApiError from '../utils/ApiError.js'

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const createAccessToken = (userId) => {
  return jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

const readGoogleProfile = async (idToken) => {
  try {
    const verifiedTicket = await googleClient.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    return verifiedTicket.getPayload()
  } catch (error) {
    throw new ApiError(401, 'Invalid Google token')
  }
}

export const loginWithGoogle = async (idToken) => {
  const googleProfile = await readGoogleProfile(idToken)

  if (!googleProfile.email_verified) throw new ApiError(401, 'Google email is not verified')

  let foundUser = await User.findOne({ googleId: googleProfile.sub })

  if (!foundUser) {
    foundUser = await User.create({
      googleId: googleProfile.sub,
      name: googleProfile.name,
      email: googleProfile.email,
      profilePictureUrl: googleProfile.picture || null,
    })
  }

  const accessToken = createAccessToken(foundUser._id)
  return { user: foundUser, accessToken: accessToken }
}

export const fetchUserById = async (userId) => {
  const foundUser = await User.findById(userId)
  if (!foundUser) throw new ApiError(401, 'User no longer exists')
  return foundUser
}