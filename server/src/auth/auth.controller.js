import { loginWithGoogle } from './auth.service.js'

export const handleGoogleLogin = async (request, response, next) => {
  try {
    const loginResult = await loginWithGoogle(request.body.idToken)
    response.status(200).json({
      success: true,
      data: {
        user: loginResult.user,
        accessToken: loginResult.accessToken,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const handleGetCurrentUser = async (request, response, next) => {
  try {
    response.status(200).json({ success: true, data: request.user })
  } catch (error) {
    next(error)
  }
}