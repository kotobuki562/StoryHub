/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable import/no-default-export */
import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "src/lib/prisma"
import { supabase } from "src/lib/supabase"

type UserInfo = {
  email?: string
  password?: string
  userName?: string
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(400).end()
    return
  }

  const userInfo: UserInfo = req.body

  if (!userInfo?.email || !userInfo?.password || !userInfo?.userName) {
    return res.status(400).send({
      message: "メールアドレスとパスワードとユーザー名は必須です",
    })
  }

  const authResult = await supabase.auth.signUp({
    email: userInfo.email,
    password: userInfo.password,
  })

  if (authResult.error) {
    return res.status(400).send({
      message: authResult.error.message,
    })
  }

  if (!authResult.user) {
    return res.status(400).send({
      message: "アカウント登録に失敗しました",
    })
  }

  // authResult.user.identitiesが空配列かundefinedの場合は、エラーを返す
  if (!authResult.user.identities || authResult.user.identities.length === 0) {
    return res.status(400).send({
      message:
        "アカウント登録に失敗しました。既に登録済みのメールアドレスです。",
    })
  }

  try {
    await prisma.user
      .create({
        data: {
          id: authResult.user.id,
          user_name: userInfo.userName,
        },
      })
      .then(result => {
        res.status(200).send(result)
      })
  } catch (error) {
    res.status(400).send({
      message: "プロフィールの作成に失敗しました。",
    })
  }

  res.status(200).send(authResult.user)
}
