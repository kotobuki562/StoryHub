/* eslint-disable @next/next/no-img-element */
/* eslint-disable import/no-default-export */

import Router from "next/router"
import { useCallback } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Alert } from "src/components/atoms/Alert"
import { Button } from "src/components/atoms/Button"
import { Input } from "src/components/atoms/Input"
import { Layout } from "src/components/Layout"
import { supabase } from "src/lib/supabase"

const Signin = () => {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm()

  const handleSignin = useCallback(async ({ email, password }) => {
    await supabase.auth
      .signIn({
        email,
        password,
      })
      .then(async res => {
        if (res.session) {
          Router.push("/")
          toast.custom(t => {
            return (
              <Alert
                t={t}
                usage="success"
                title="ログインしました！"
                message="心ゆくまでお楽しみください"
              />
            )
          })
        } else {
          toast.custom(t => {
            return (
              <Alert
                t={t}
                usage="warning"
                title="未登録のユーザーです"
                message={res.error?.message}
              />
            )
          })
        }
      })
      .catch(error => {
        toast.custom(t => {
          return (
            <Alert
              t={t}
              usage="error"
              title="ログインに失敗しました"
              message={error.message}
            />
          )
        })
      })
  }, [])

  const handleSigninWithGoogle = useCallback(async () => {
    await supabase.auth
      .signIn({
        provider: "google",
      })
      .then(res => {
        if (res.session) {
          Router.push("/")
          toast.custom(t => {
            return (
              <Alert
                t={t}
                usage="success"
                title="ログインしました！"
                message="心ゆくまでお楽しみください"
              />
            )
          })
        }
      })
      .catch(error => {
        toast.custom(t => {
          return (
            <Alert
              t={t}
              usage="error"
              title="ログインに失敗しました"
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
          onSubmit={handleSubmit(handleSignin)}
        >
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

          <Button type="submit" usage="base" text="ログイン" />
        </form>
      </div>
    </Layout>
  )
}

export default Signin
