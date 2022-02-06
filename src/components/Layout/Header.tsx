/* eslint-disable @next/next/no-img-element */
import { useMutation } from "@apollo/client"
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
  PencilIcon,
  PhotographIcon,
  SearchIcon,
  UserAddIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/solid"
import cc from "classcat"
import { format } from "date-fns"
import gql from "graphql-tag"
import Link from "next/link"
import { useRouter } from "next/router"
import { memo, useCallback, useMemo, useState } from "react"
import { Accordion } from "src/components/blocks/Accodion"
import { Menu } from "src/components/blocks/Menu"
import type { NexusGenObjects } from "src/generated/nexus-typegen"
import { useSwrQuery } from "src/hooks/swr"
import { supabase } from "src/lib/supabase"
import type { QueryNotificationsForUser } from "src/types/Notification/query"
import type { GoogleAccount } from "src/types/User/shcame"

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
  query Query($accessToken: String!) {
    QueryNotificationsForUser(accessToken: $accessToken) {
      id
      created_at
      user {
        user_name
        image
        id
      }
      review {
        id
        review_title
        stars
      }
    }
  }
`

const NotificationDelete = gql`
  mutation Mutation(
    $accessToken: String!
    $notificationId: String!
    $receiverId: String!
  ) {
    deleteNotification(
      accessToken: $accessToken
      notificationId: $notificationId
      receiverId: $receiverId
    ) {
      id
    }
  }
`

const NotificationAllDelete = gql`
  mutation DeleteAllNotifications($accessToken: String!) {
    deleteAllNotifications(accessToken: $accessToken) {
      id
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
  const [isOpenUserStoryAccordion, setOpenUserStoryAccordion] =
    useState<boolean>(false)
  const [isOpenUserSettingMaterial, setOpenUserSettingMaterial] =
    useState<boolean>(false)

  const [isHiddenMainManu, setHiddenMainManu] = useState<boolean>(true)
  const [isHiddenUserManu, setHiddenUserManu] = useState<boolean>(true)
  const [isHiddenNotification, setHiddenNotification] = useState<boolean>(true)
  const [isHiddenSearch, setHiddenSearch] = useState<boolean>(true)
  const userInfo = supabase.auth.user()
  const accessToken = useMemo(() => {
    return supabase.auth.session()?.access_token
  }, [])

  const googleAccountMetadata = useMemo(() => {
    return userInfo?.user_metadata as GoogleAccount["user_metadata"]
  }, [userInfo])

  const { data: notifications, mutate } =
    useSwrQuery<QueryNotificationsForUser>(NotificationsQuery, {
      accessToken: accessToken ? accessToken : null,
    })

  const { data: user } = useSwrQuery<QueryMe>(Me, {
    accessToken: accessToken ? accessToken : null,
  })

  const [deleteNotification] = useMutation(NotificationDelete)
  const [deleteAllNotifications] = useMutation(NotificationAllDelete)

  const handleDeleteNotification = useCallback(
    async (id: string) => {
      await deleteNotification({
        variables: {
          accessToken,
          notificationId: id,
          receiverId: userInfo?.id,
        },
      })
      await mutate()
    },
    [accessToken, deleteNotification, mutate, userInfo?.id]
  )

  const handleDeleteAllNotifications = useCallback(async () => {
    await deleteAllNotifications({
      variables: {
        accessToken,
      },
    })
    await mutate()
  }, [accessToken, deleteAllNotifications, mutate])

  const notificationLength = useMemo(() => {
    return notifications?.QueryNotificationsForUser
      ? notifications?.QueryNotificationsForUser.length
      : 0
  }, [notifications])

  const userLinks = [
    {
      href: `/myPage/${userInfo?.id}/review`,
      label: "レビュー",
      icon: <FireIcon className="w-6 h-6" />,
    },
    {
      href: `/myPage/${userInfo?.id}/follow`,
      label: "フォロー",
      icon: <UserGroupIcon className="w-6 h-6" />,
    },
    {
      href: `/myPage/${userInfo?.id}/favorite`,
      label: "ブックマーク",
      icon: <BookmarkIcon className="w-6 h-6" />,
    },
    {
      href: `/myPage/${userInfo?.id}/contents`,
      label: "コンテンツ",
      icon: <PhotographIcon className="w-6 h-6" />,
    },
  ]

  const userStoryLinks = [
    {
      href: `/myPage/${userInfo?.id}/story`,
      label: "一覧で見る",
      icon: <BookOpenIcon className="w-6 h-6" />,
    },
    {
      href: `/myPage/${userInfo?.id}/story/create`,
      label: "作成する",
      icon: <PencilIcon className="w-6 h-6" />,
    },
  ]

  const userSettingMaterialLinks = [
    {
      href: `/myPage/${userInfo?.id}/settingMaterial`,
      label: "一覧で見る",
      icon: <PhotographIcon className="w-6 h-6" />,
    },
    {
      href: `/myPage/${userInfo?.id}/settingMaterial/create`,
      label: "作成する",
      icon: <PencilIcon className="w-6 h-6" />,
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
    setOpenUserAccodion(pre => {
      return !pre
    })
  }, [])

  const onToggleUserActionAccodion = useCallback(() => {
    setOpenUserActionAccodion(pre => {
      return !pre
    })
  }, [])

  const onToggleUserStoryAccordion = useCallback(() => {
    setOpenUserStoryAccordion(pre => {
      return !pre
    })
  }, [])

  const onToggleUserSettingMaterial = useCallback(() => {
    setOpenUserSettingMaterial(pre => {
      return !pre
    })
  }, [])

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

  const onToggleNotification = useCallback(() => {
    setHiddenNotification(pre => {
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

  const handleCloseNotification = useCallback(() => {
    setHiddenNotification(true)
  }, [])

  const handleCloseSearch = useCallback(() => {
    setHiddenSearch(true)
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
            onClose={handleCloseMainManu}
            viewer={
              <div
                className={cc([
                  "flex items-center font-mono p-2 text-xl font-black group-hover:text-purple-400 group-hover:bg-slate-100 rounded-xl duration-200 sm:px-4",
                  !isHiddenMainManu && "bg-slate-100 text-purple-400",
                ])}
              >
                <p className="mr-2">{renderMainLinks}</p>
                <ChevronDownIcon className="w-5 h-5" />
              </div>
            }
          >
            <div className="flex flex-col">
              {mainLinks.map(({ href, icon, label }) => {
                return (
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
          onClose={handleCloseNotification}
          viewer={
            <div className="relative mr-4 w-10">
              {notificationLength !== 0 && (
                <div
                  className={cc([
                    "absolute -top-3 -right-3 w-7 h-7 rounded-full flex flex-col items-center justify-center",
                    !isHiddenNotification
                      ? "text-white bg-purple-500 border-2 border-white"
                      : "text-purple-500 hover:bg-slate-100 ",
                  ])}
                >
                  {notificationLength >= 9 ? "9+" : notificationLength}
                </div>
              )}

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
          <div className="overflow-scroll w-[210px] max-h-screen no-scrollbar">
            {notificationLength > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                <button
                  className="py-2 w-full font-bold text-purple-500 bg-purple-100 rounded-md"
                  onClick={handleDeleteAllNotifications}
                >
                  {notificationLength}
                  件全て既読にする
                </button>
                {notifications?.QueryNotificationsForUser.map(data => {
                  return (
                    <div className="group" key={data.id}>
                      <div className="flex items-center mb-2">
                        <div className="mr-2 min-w-[2rem]">
                          <img
                            className="w-8 h-8 rounded-full"
                            src={data.user?.image || "/img/Vector.png"}
                            alt="avatar"
                          />
                        </div>
                        <p className="text-sm">
                          {data.user?.user_name}さんから
                        </p>
                      </div>
                      {data.review && (
                        <Link
                          href={{
                            pathname: "/review/[reviewId]",
                            query: { reviewId: data.review.id },
                          }}
                        >
                          <a className="flex items-center py-1 px-2 mb-2 text-purple-500 bg-purple-100 rounded-full duration-200">
                            <div className="mr-2 min-w-[2rem]">
                              <img
                                className="w-8 h-8 rounded-full"
                                src={`/img/${data.review.stars}.svg`}
                                alt="avatar"
                              />
                            </div>
                            <p className="text-sm">
                              {data.review.review_title &&
                              data.review.review_title?.length > 20 ? (
                                <span>
                                  {data.review.review_title.slice(0, 20)}
                                  ...
                                </span>
                              ) : (
                                data.review.review_title
                              )}
                            </p>
                          </a>
                        </Link>
                      )}
                      {data.created_at && (
                        <p className="text-xs text-right text-slate-600">
                          {format(
                            new Date(data.created_at),
                            "yyyy/MM/dd HH:mm"
                          )}
                        </p>
                      )}

                      <div>
                        <button
                          className="text-sm text-purple-500"
                          onClick={() => {
                            return handleDeleteNotification(data.id as string)
                          }}
                        >
                          既読にする
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-slate-400">現在通知は届いていません</p>
            )}
          </div>
        </Menu>

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
            <div className="flex flex-col w-[230px]">
              {userInfo && (
                <>
                  <div className="py-2 px-4 mb-4 border-b border-slate-200">
                    <p className="mb-2 text-sm text-slate-400">
                      ログイン中のアカウント:
                    </p>
                    <div className="flex">
                      <div className="mr-2 min-w-[40px]">
                        <img
                          className="w-10 h-10 rounded-full"
                          src={
                            user?.QueryMe?.image ||
                            googleAccountMetadata?.avatar_url ||
                            "/img/Vector.png"
                          }
                          alt={
                            user?.QueryMe?.user_name ||
                            googleAccountMetadata?.full_name ||
                            "avatar"
                          }
                        />
                      </div>
                      <div className="overflow-scroll no-scrollbar">
                        <p className="font-bold">
                          {user?.QueryMe?.user_name ||
                            googleAccountMetadata?.full_name}
                        </p>
                        <p className="text-sm text-slate-400">
                          {userInfo.email}
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
                      <Link href={`/myPage/${userInfo.id}/profile`}>
                        <a
                          className={cc([
                            "py-2 px-4 w-full text-lg flex font-bold items-center text-slate-600 hover:bg-slate-100 hover:text-purple-400 justify-between rounded-xl duration-200",
                            router.pathname ===
                              `/myPage/${userInfo.id}/profile` &&
                              "bg-slate-100 text-purple-400",
                          ])}
                        >
                          <p>プロフィール</p>
                          <div className="w-8">
                            <UserCircleIcon className="w-6 h-6" />
                          </div>
                        </a>
                      </Link>

                      {userLinks.map(({ href, icon, label }) => {
                        return (
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
                        )
                      })}
                    </Accordion>
                  </div>
                  <div className="mb-4">
                    <Accordion
                      isOpen={isOpenUserStoryAccordion}
                      onToggle={onToggleUserStoryAccordion}
                      toggleButton={
                        <div
                          className={cc([
                            "py-2 px-4 w-full text-lg flex font-bold items-center bg-slate-100 hover:bg-slate-100 hover:text-purple-400 justify-between rounded-xl duration-200",
                            isOpenUserStoryAccordion && "text-purple-400",
                          ])}
                        >
                          <p>ストーリー</p>
                          <div className="w-8">
                            {isOpenUserStoryAccordion ? (
                              <ChevronUpIcon className="w-8 h-8" />
                            ) : (
                              <ChevronDownIcon className="w-8 h-8" />
                            )}
                          </div>
                        </div>
                      }
                    >
                      {userStoryLinks.map(({ href, icon, label }) => {
                        return (
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
                        )
                      })}
                    </Accordion>
                  </div>
                  <div className="mb-4">
                    <Accordion
                      isOpen={isOpenUserSettingMaterial}
                      onToggle={onToggleUserSettingMaterial}
                      toggleButton={
                        <div
                          className={cc([
                            "py-2 px-4 w-full text-lg flex font-bold items-center bg-slate-100 hover:bg-slate-100 hover:text-purple-400 justify-between rounded-xl duration-200",
                            isOpenUserSettingMaterial && "text-purple-400",
                          ])}
                        >
                          <p>設定資料</p>
                          <div className="w-8">
                            {isOpenUserSettingMaterial ? (
                              <ChevronUpIcon className="w-8 h-8" />
                            ) : (
                              <ChevronDownIcon className="w-8 h-8" />
                            )}
                          </div>
                        </div>
                      }
                    >
                      {userSettingMaterialLinks.map(({ href, icon, label }) => {
                        return (
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
                        )
                      })}
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
              {!userInfo && (
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
