/* eslint-disable @next/next/no-img-element */
/* eslint-disable import/no-default-export */

import axios from "axios"
import Router from "next/router"
import { useCallback } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Alert } from "src/components/atoms/Alert"
import { Button } from "src/components/atoms/Button"
import { Input } from "src/components/atoms/Input"
import { Layout } from "src/components/Layout"
import { supabase } from "src/lib/supabase"

const SignUp = () => {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm()

  const handleSignup = handleSubmit(async ({ email, password, userName }) => {
    await axios
      .post("/api/auth/signup", {
        email,
        password,
        userName,
      })
      .then(() => {
        Router.push("/signin")
        toast.custom(t => {
          return (
            <Alert
              t={t}
              usage="success"
              title="アカウント登録しました"
              message="送信したメールの認証リンクに接続してからログインしてください"
            />
          )
        })
      })
      .catch(error => {
        toast.custom(t => {
          return (
            <Alert
              t={t}
              usage="error"
              title="ログインに失敗しました"
              message={error.response.data.message}
            />
          )
        })
      })
  })

  const handleSigninWithGoogle = useCallback(async () => {
    await supabase.auth
      .signIn({
        provider: "google",
      })
      .then(res => {
        // eslint-disable-next-line no-console
        console.log(res)

        if (res.session) {
          Router.push("/signin")
          toast.custom(t => {
            return (
              <Alert
                t={t}
                usage="success"
                title="アカウントの作成に成功しました"
                message="登録したメールアドレス宛に認証のリンクを送信しました。認証後ログインしてください。"
              />
            )
          })
        }
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log(error)

        toast.custom(t => {
          return (
            <Alert
              t={t}
              usage="error"
              title="アカウントの作成に失敗しました"
              message={error.message}
            />
          )
        })
      })
  }, [])

  return (
    <Layout
      meta={{
        pageName: `StoryHub | ログイン`,
        description: `メールアドレスとパスワードで簡単ログイン`,
        cardImage: `/img/StoryHubLogo.png`,
      }}
    >
      <div className="flex flex-col justify-center items-center w-full">
        <img
          className="w-[300px] xs:w-[500px]"
          src="/img/StoryHubLogo.png"
          alt="Logo"
        />
        <Button
          type="button"
          usage="base"
          text="Google"
          onClick={handleSigninWithGoogle}
        />
        <form
          className="grid grid-cols-1 gap-5 w-[300px] xs:w-[500px]"
          onSubmit={handleSignup}
        >
          <div className="w-full">
            <Input
              label="User Name"
              type="text"
              placeholder="User Name"
              {...register("userName", {
                required: "ユーザー名は必須です",
              })}
              error={{
                isError: errors.userName,
                message: errors.userName?.message,
              }}
            />
          </div>
          <div className="w-full">
            <Input
              label="Email"
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "メールアドレスは必須です",
              })}
              error={{
                isError: errors.email,
                message: errors.email?.message,
              }}
            />
          </div>

          <div className="w-full">
            <Input
              label="Password"
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "パスワードは必須です",
              })}
              error={{
                isError: errors.password,
                message: errors.password?.message,
              }}
            />
          </div>

          <Button type="submit" usage="base" text="新規登録" />
        </form>
      </div>
    </Layout>
  )
}

export default SignUp
