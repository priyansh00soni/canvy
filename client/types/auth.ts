export type User = {
  _id: string
  googleId: string
  name: string
  email: string
  profilePictureUrl: string | null
  createdAt: string
  updatedAt: string
}

export type LoginResponse = {
  user: User
  accessToken: string
}
