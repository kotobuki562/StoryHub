/* eslint-disable @next/next/no-img-element */
import { useQuery } from "@apollo/client"
import {
  BellIcon,
  BookmarkIcon,
  BookOpenIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FireIcon,
  HomeIcon,
  LoginIcon,
  LogoutIcon,
  MailIcon,
  PhotographIcon,
  SearchIcon,
  UserAddIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/solid"
import cc from "classcat"
import gql from "graphql-tag"
import Link from "next/link"
import { useRouter } from "next/router"
import { memo, useCallback, useMemo, useState } from "react"
import { Accordion } from "src/components/blocks/Accodion"
import { Menu } from "src/components/blocks/Menu"
import type { NexusGenObjects } from "src/generated/nexus-typegen"
import { supabase } from "src/lib/supabase"

const Me = gql`
  query QueryMe($accessToken: String!) {
    QueryMe(accessToken: $accessToken) {
      id
      user_name
      user_deal
      image
    }
  }
`

type QueryMe = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  QueryMe: NexusGenObjects["User"]
}

const mainLinks = [
  { href: "/", label: "トップ", icon: <HomeIcon className="w-6 h-6" /> },
  {
    href: "/story",
    label: "ストーリー",
    icon: <BookOpenIcon className="w-6 h-6" />,
  },
  {
    href: "/settingMaterial",
    label: "設定資料",
    icon: <PhotographIcon className="w-6 h-6" />,
  },
  {
    href: "/review",
    label: "レビュー",
    icon: <FireIcon className="w-6 h-6" />,
  },
]

const HeaderComp = () => {
  const [isOpenUserAccodion, setOpenUserAccodion] = useState<boolean>(false)
  const [isOpenUserActionAccodion, setOpenUserActionAccodion] =
    useState<boolean>(false)
  const [isHiddenMainManu, setHiddenMainManu] = useState<boolean>(true)
  const [isHiddenUserManu, setHiddenUserManu] = useState<boolean>(true)
  const [isHiddenNotification, setHiddenNotification] = useState<boolean>(true)
  const [isHiddenSearch, setHiddenSearch] = useState<boolean>(true)
  const userInfo = supabase.auth.user()
  const accessToken = useMemo(() => supabase.auth.session()?.access_token, [])
  const { data: user } = useQuery<QueryMe>(Me, {
    variables: {
      accessToken,
    },
  })

  const userLinks = [
    {
      href: `/myPage/${user?.QueryMe.id}/profile`,
      label: "プロフィール",
      icon: <UserCircleIcon className="w-6 h-6" />,
    },
    {
      href: `/myPage/${user?.QueryMe.id}/story`,
      label: "ストーリー",
      icon: <BookOpenIcon className="w-6 h-6" />,
    },
    {
      href: `/myPage/${user?.QueryMe.id}/settingMaterial`,
      label: "設定資料",
      icon: <PhotographIcon className="w-6 h-6" />,
    },
    {
      href: `/myPage/${user?.QueryMe.id}/review`,
      label: "レビュー",
      icon: <FireIcon className="w-6 h-6" />,
    },
    {
      href: `/myPage/${user?.QueryMe.id}/follow`,
      label: "フォロー",
      icon: <UserGroupIcon className="w-6 h-6" />,
    },
    {
      href: `/myPage/${user?.QueryMe.id}/favorite`,
      label: "ブックマーク",
      icon: <BookmarkIcon className="w-6 h-6" />,
    },
  ]

  const router = useRouter()

  const renderMainLinks = useMemo(() => {
    switch (router.asPath) {
      case "/":
        return "HOME"
      case "/story":
        return "STORY"
      case "/settingMaterial":
        return "MATERIAL"
      case "/review":
        return "REVIEW"
      default:
        return "HOME"
    }
  }, [router.asPath])

  const onToggleUserAccodion = useCallback(() => {
    setOpenUserAccodion(pre => !pre)
  }, [])

  const onToggleUserActionAccodion = useCallback(() => {
    setOpenUserActionAccodion(pre => !pre)
  }, [])

  const onToggleMainManu = useCallback(() => {
    setHiddenMainManu(pre => !pre)
  }, [])

  const onToggleUserManu = useCallback(() => {
    setHiddenUserManu(pre => !pre)
  }, [])

  const onToggleNotification = useCallback(() => {
    setHiddenNotification(pre => !pre)
  }, [])

  const onToggleSearch = useCallback(() => {
    setHiddenSearch(pre => !pre)
  }, [])

  const handleSignOut = useCallback(() => {
    supabase.auth.signOut().then(() => {
      router.push("/signin")
    })
  }, [router])

  const handleSendResetPasswordEmail = useCallback(() => {
    supabase.auth.api.resetPasswordForEmail(`${userInfo?.email}`)
  }, [userInfo?.email])

  return (
    <nav className="flex sticky top-0 z-10 justify-between items-center py-2 px-4 bg-white">
      <div className="flex items-center">
        <Link href="/">
          <a className="flex items-center mr-4">
            <img
              className="w-10 h-10 rounded-full"
              src="/img/StoryHubIcon.png"
              alt="icon"
            />
          </a>
        </Link>

        <div className="group">
          <Menu
            isHidden={isHiddenMainManu}
            onToggle={onToggleMainManu}
            viewer={
              <div
                className={cc([
                  "flex items-center p-2 text-xl font-black group-hover:text-purple-400 group-hover:bg-slate-100 rounded-xl duration-200 sm:px-4",
                  !isHiddenMainManu && "bg-slate-100 text-purple-400",
                ])}
              >
                <p className="mr-2">{renderMainLinks}</p>
                <ChevronDownIcon className="w-5 h-5" />
              </div>
            }
          >
            <div className="flex flex-col">
              {mainLinks.map(({ href, icon, label }) => (
                <Link key={label} href={href}>
                  <a
                    className={cc([
                      "py-2 px-4 w-[200px] text-lg flex font-bold items-center text-slate-600 hover:bg-slate-100 hover:text-purple-400 justify-between rounded-xl duration-200",
                      router.pathname === href &&
                        "bg-slate-100 text-purple-400",
                    ])}
                  >
                    <p>{label}</p>
                    <div className="w-8">{icon}</div>
                  </a>
                </Link>
              ))}
            </div>
          </Menu>
        </div>
      </div>
      <div className="flex items-center">
        <Menu
          isHidden={isHiddenSearch}
          onToggle={onToggleSearch}
          viewer={
            <div className="mr-4 w-10">
              <SearchIcon
                className={cc([
                  "p-2 w-10 h-10 duration-200 rounded-full",
                  !isHiddenSearch
                    ? "text-white bg-purple-500"
                    : "text-purple-500 hover:bg-slate-100",
                ])}
              />
            </div>
          }
        >
          <div>
            <p className="text-slate-400">検索機能</p>
          </div>
        </Menu>

        <Menu
          isHidden={isHiddenNotification}
          onToggle={onToggleNotification}
          viewer={
            <div className="mr-4 w-10">
              <BellIcon
                className={cc([
                  "p-2 w-10 h-10 duration-200 rounded-full",
                  !isHiddenNotification
                    ? "text-white bg-purple-500"
                    : "text-purple-500 hover:bg-slate-100",
                ])}
              />
            </div>
          }
        >
          <div>
            <p className="text-slate-400">現在通知は届いていません</p>
          </div>
        </Menu>

        <div className="group">
          <Menu
            isHidden={isHiddenUserManu}
            onToggle={onToggleUserManu}
            position={-80}
            viewer={
              <div
                className={cc([
                  "flex items-center p-2 font-black group-hover:bg-slate-100 rounded-xl duration-200 sm:px-4",
                  !isHiddenUserManu && "bg-slate-100",
                ])}
              >
                <div className="mr-2">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={user?.QueryMe.image || "/img/Vector.png"}
                    alt="avatar"
                  />
                </div>

                <ChevronDownIcon className="w-5 h-5" />
              </div>
            }
          >
            <div className="flex flex-col w-[230px]">
              {user && (
                <>
                  <div className="py-2 px-4 mb-4 border-b border-slate-200">
                    <p className="mb-2 text-sm text-slate-400">
                      ログイン中のアカウント:
                    </p>
                    <div className="flex">
                      <div className="mr-2 w-10">
                        <img
                          className="w-10 h-10 rounded-full"
                          src={user.QueryMe.image || "/img/Vector.png"}
                          alt={user.QueryMe.user_name || "avatar"}
                        />
                      </div>
                      <div className="overflow-scroll no-scrollbar">
                        <p className="font-bold">{user.QueryMe.user_name}</p>
                        <p className="text-sm text-slate-400">
                          {userInfo?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <Accordion
                      isOpen={isOpenUserAccodion}
                      onToggle={onToggleUserAccodion}
                      toggleButton={
                        <div
                          className={cc([
                            "py-2 px-4 w-full text-lg flex font-bold items-center bg-slate-100 hover:bg-slate-100 hover:text-purple-400 justify-between rounded-xl duration-200",
                            isOpenUserAccodion && "text-purple-400",
                          ])}
                        >
                          <p>ユーザーコンテンツ</p>
                          <div className="w-8">
                            {isOpenUserAccodion ? (
                              <ChevronUpIcon className="w-8 h-8" />
                            ) : (
                              <ChevronDownIcon className="w-8 h-8" />
                            )}
                          </div>
                        </div>
                      }
                    >
                      {userLinks.map(({ href, icon, label }) => (
                        <Link key={label} href={href}>
                          <a
                            className={cc([
                              "py-2 px-4 w-full text-lg flex font-bold items-center text-slate-600 hover:bg-slate-100 hover:text-purple-400 justify-between rounded-xl duration-200",
                              router.pathname === href &&
                                "bg-slate-100 text-purple-400",
                            ])}
                          >
                            <p>{label}</p>
                            <div className="w-8">{icon}</div>
                          </a>
                        </Link>
                      ))}
                    </Accordion>
                  </div>

                  <Accordion
                    isOpen={isOpenUserActionAccodion}
                    onToggle={onToggleUserActionAccodion}
                    toggleButton={
                      <div
                        className={cc([
                          "py-2 px-4 w-full text-lg flex font-bold bg-slate-100 items-center hover:bg-slate-100 hover:text-purple-400 justify-between rounded-xl duration-200",
                          isOpenUserActionAccodion && "text-purple-400",
                        ])}
                      >
                        <p>その他</p>
                        <div className="w-8">
                          {isOpenUserActionAccodion ? (
                            <ChevronUpIcon className="w-8 h-8" />
                          ) : (
                            <ChevronDownIcon className="w-8 h-8" />
                          )}
                        </div>
                      </div>
                    }
                  >
                    <button
                      className="flex justify-between items-center py-2 px-4 w-full text-lg font-bold hover:text-yellow-400 hover:bg-purple-500 rounded-xl duration-200"
                      onClick={handleSignOut}
                    >
                      <p>ログアウト</p>
                      <div className="w-8">
                        <LogoutIcon className="w-8 h-8" />
                      </div>
                    </button>
                    <button
                      className="flex justify-between items-center py-2 px-4 w-full text-lg font-bold hover:text-yellow-400 hover:bg-purple-500 rounded-xl duration-200"
                      onClick={handleSendResetPasswordEmail}
                    >
                      <p>パスワードリセット</p>
                      <div className="w-8">
                        <MailIcon className="w-8 h-8" />
                      </div>
                    </button>
                  </Accordion>
                </>
              )}
              {!user && (
                <div>
                  <Link href="/signin">
                    <a className="flex justify-between items-center py-2 px-4 w-full text-lg font-bold hover:text-yellow-400 hover:bg-purple-500 rounded-xl duration-200">
                      <p>ログイン</p>
                      <div className="w-8">
                        <LoginIcon className="w-8 h-8" />
                      </div>
                    </a>
                  </Link>
                  <Link href="/signup">
                    <a className="flex justify-between items-center py-2 px-4 w-full text-lg font-bold hover:text-yellow-400 hover:bg-purple-500 rounded-xl duration-200">
                      <p>新規登録</p>
                      <div className="w-8">
                        <UserAddIcon className="w-8 h-8" />
                      </div>
                    </a>
                  </Link>
                </div>
              )}
            </div>
          </Menu>
        </div>
      </div>
    </nav>
  )
}

export const Header = memo(HeaderComp)
