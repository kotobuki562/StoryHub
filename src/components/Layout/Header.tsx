/* eslint-disable @next/next/no-img-element */

import {
  BellIcon,
  BookOpenIcon,
  ChevronDownIcon,
  FireIcon,
  HomeIcon,
  LoginIcon,
  PhotographIcon,
  SearchIcon,
  UserAddIcon,
} from "@heroicons/react/solid"
import cc from "classcat"
import gql from "graphql-tag"
import Link from "next/link"
import { useRouter } from "next/router"
import { memo, useCallback, useMemo, useState } from "react"
import { Menu } from "src/components/blocks/Menu"
import type { NexusGenObjects } from "src/generated/nexus-typegen"
import { useSwrQuery } from "src/hooks/swr"
import { supabase } from "src/lib/supabase"
import type { QueryNotificationsForUserByIsRead } from "src/types/Notification/query"
import type { GoogleAccount } from "src/types/User/shcame"

import { NotificationBar } from "./Notificate"
import { UserBar } from "./User"

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

const NotificationsQuery = gql`
  query QueryNotificationsForUserByIsRead($accessToken: String!) {
    QueryNotificationsForUserByIsRead(accessToken: $accessToken) {
      id
    }
  }
`

type QueryMe = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  QueryMe: NexusGenObjects["User"]
}

const mainLinks = [
  {
    href: "/",
    label: "トップ",
    icon: <HomeIcon className="w-5 h-5 xs:w-6 xs:h-6" />,
  },
  {
    href: "/story",
    label: "ストーリー",
    icon: <BookOpenIcon className="w-5 h-5 xs:w-6 xs:h-6" />,
  },
  {
    href: "/settingMaterial",
    label: "設定資料",
    icon: <PhotographIcon className="w-5 h-5 xs:w-6 xs:h-6" />,
  },
  {
    href: "/review",
    label: "レビュー",
    icon: <FireIcon className="w-5 h-5 xs:w-6 xs:h-6" />,
  },
]

const HeaderComp = () => {
  const [isHiddenMainManu, setHiddenMainManu] = useState<boolean>(true)
  const [isHiddenUserManu, setHiddenUserManu] = useState<boolean>(true)

  const [isHiddenSearch, setHiddenSearch] = useState<boolean>(true)
  const userInfo = supabase.auth.user()
  const accessToken = useMemo(() => {
    return supabase.auth.session()?.access_token
  }, [])
  NotificationBar
  const googleAccountMetadata = useMemo(() => {
    return userInfo?.user_metadata as GoogleAccount["user_metadata"]
  }, [userInfo])

  const { data: notifications } =
    useSwrQuery<QueryNotificationsForUserByIsRead>(NotificationsQuery, {
      accessToken: accessToken ? accessToken : null,
    })

  const { data: user } = useSwrQuery<QueryMe>(Me, {
    accessToken: accessToken ? accessToken : null,
  })

  const notificationLength = useMemo(() => {
    return notifications?.QueryNotificationsForUserByIsRead
      ? notifications?.QueryNotificationsForUserByIsRead.length
      : 0
  }, [notifications])

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

  const onToggleMainManu = useCallback(() => {
    setHiddenMainManu(pre => {
      return !pre
    })
  }, [])

  const onToggleUserManu = useCallback(() => {
    setHiddenUserManu(pre => {
      return !pre
    })
  }, [])

  const onToggleSearch = useCallback(() => {
    setHiddenSearch(pre => {
      return !pre
    })
  }, [])

  const handleCloseMainManu = useCallback(() => {
    setHiddenMainManu(true)
  }, [])

  const handleCloseUserManu = useCallback(() => {
    setHiddenUserManu(true)
  }, [])

  const handleCloseSearch = useCallback(() => {
    setHiddenSearch(true)
  }, [])

  return (
    <nav className="flex sticky top-0 z-10 justify-between items-center p-2 bg-white xs:px-4">
      <div className="flex items-center">
        <Link href="/">
          <a className="flex items-center mr-4">
            <img
              className="w-8 h-8 rounded-full xs:w-10 xs:h-10"
              src="/img/StoryHubIcon.png"
              alt="icon"
            />
          </a>
        </Link>

        <div className="group">
          <Menu
            isHidden={isHiddenMainManu}
            onToggle={onToggleMainManu}
            onClose={handleCloseMainManu}
            viewer={
              <div
                className={cc([
                  "flex items-center font-mono p-2 xs:text-xl font-black group-hover:text-purple-400 group-hover:bg-slate-100 rounded-xl duration-200 sm:px-4",
                  !isHiddenMainManu && "bg-slate-100 text-purple-400",
                ])}
              >
                <p className="mr-2">{renderMainLinks}</p>
                <ChevronDownIcon className="w-5 h-5" />
              </div>
            }
          >
            <div className="flex flex-col p-2 h-full">
              {mainLinks.map(({ href, icon, label }) => {
                return (
                  <Link key={label} href={href}>
                    <a
                      className={cc([
                        "py-2 px-4 w-[150px] xs:w-[200px] flex font-bold items-center text-slate-600 hover:bg-slate-100 hover:text-purple-400 justify-between rounded-xl duration-200",
                        router.pathname === href &&
                          "bg-slate-100 text-purple-400",
                      ])}
                    >
                      <p>{label}</p>
                      <div className="w-6 xs:w-8">{icon}</div>
                    </a>
                  </Link>
                )
              })}
            </div>
          </Menu>
        </div>
      </div>
      <div className="flex items-center">
        <Menu
          isHidden={isHiddenSearch}
          onToggle={onToggleSearch}
          onClose={handleCloseSearch}
          viewer={
            <div className="p-2 mr-4 w-8 xs:w-10">
              <SearchIcon
                className={cc([
                  "p-1 xs:p-2 xs:w-10 xs:h-10 w-8 h-8 duration-200 rounded-full",
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

        <Link href={`/myPage/${user?.QueryMe.id}/inbox`}>
          <a className="block relative mr-4 w-8 xs:w-10">
            {notificationLength !== 0 && (
              <div className="flex absolute top-0 right-0 flex-col justify-center items-center w-2 h-2 text-white bg-purple-500 rounded-full xs:w-3 xs:h-3"></div>
            )}

            <BellIcon
              className={cc([
                "p-1 xs:p-2 w-8 h-8 xs:w-10 xs:h-10 text-purple-500 hover:bg-slate-100 duration-200 rounded-full",
              ])}
            />
          </a>
        </Link>

        <div className="group">
          <Menu
            isHidden={isHiddenUserManu}
            onToggle={onToggleUserManu}
            onClose={handleCloseUserManu}
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
                    src={
                      user?.QueryMe?.image ||
                      googleAccountMetadata?.avatar_url ||
                      "/img/Vector.png"
                    }
                    alt="avatar"
                  />
                </div>

                <ChevronDownIcon className="w-5 h-5" />
              </div>
            }
          >
            <div className="flex overflow-y-scroll relative flex-col p-2 w-[220px] max-h-[500px] xs:w-[230px] xs:max-h-screen">
              {userInfo ? (
                <UserBar
                  user={user?.QueryMe}
                  userInfo={userInfo}
                  google={googleAccountMetadata}
                />
              ) : (
                <div>
                  <Link href="/signin">
                    <a className="flex justify-between items-center py-2 px-4 w-full font-bold hover:text-yellow-400 hover:bg-purple-500 rounded-xl duration-200">
                      <p>ログイン</p>
                      <div className="w-6 xs:w-8">
                        <LoginIcon className="w-6 h-6" />
                      </div>
                    </a>
                  </Link>
                  <Link href="/signup">
                    <a className="flex justify-between items-center py-2 px-4 w-full font-bold hover:text-yellow-400 hover:bg-purple-500 rounded-xl duration-200">
                      <p>新規登録</p>
                      <div className="w-6 xs:w-8">
                        <UserAddIcon className="w-6 h-6" />
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
