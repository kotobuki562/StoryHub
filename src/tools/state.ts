import jwt from "jsonwebtoken"

export const isMe = (userId: string, accessToken: string) => {
  if (!accessToken) {
    throw new Error("Invalid token")
  }
  const decodeData = jwt.decode(accessToken)
  const user_id = decodeData?.sub
  return userId === user_id ? true : false
}
