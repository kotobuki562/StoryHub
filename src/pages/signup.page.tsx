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
import { Tab } from "src/components/blocks/Tab"
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
      <div
        className="flex relative flex-col w-full"
        style={{
          backgroundImage: `url("/img/Welcome.gif")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "calc(100vh - 64px)",
        }}
      >
        <div
          className="flex overflow-scroll absolute inset-0 flex-col items-center py-8 w-full bg-white/80 backdrop-blur"
          style={{
            height: "calc(100vh - 64px)",
          }}
        >
          <img
            className="w-[300px] xs:w-[500px]"
            src="/img/StoryHubLogo.png"
            alt="Logo"
          />
          <div className="w-[300px] xs:w-[500px]">
            <Tab
              color="purple"
              values={[
                {
                  label: "シンプル登録",
                  children: (
                    <form
                      className="grid grid-cols-1 gap-5 py-4 w-[300px] xs:w-[500px]"
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
                  ),
                },
                {
                  label: "Googleで登録",
                  children: (
                    <div className="py-4">
                      <div className="mb-8">
                        <Button
                          type="button"
                          usage="base"
                          text="Google"
                          onClick={handleSigninWithGoogle}
                        />
                      </div>

                      <ul className="ml-4 list-disc text-red-500">
                        <li>Googleでアカウント登録する場合の注意点</li>
                        <li>
                          アカウント登録後は必ずプロフィールの作成を行ってください。
                        </li>
                        <li>
                          プロフィールが作成されなければコンテンツの作成ができません
                        </li>
                      </ul>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default SignUp
