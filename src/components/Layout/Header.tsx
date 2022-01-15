/* eslint-disable @next/next/no-img-element */
import { useQuery } from "@apollo/client"
import {
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
  { href: "/", label: "HOME", icon: <HomeIcon className="w-6 h-6" /> },
  {
    href: "/story",
    label: "STORY",
    icon: <BookOpenIcon className="w-6 h-6" />,
  },
  {
    href: "/settingMaterial",
    label: "MATERIAL",
    icon: <PhotographIcon className="w-6 h-6" />,
  },
  {
    href: "/review",
    label: "REVIEW",
    icon: <FireIcon className="w-6 h-6" />,
  },
]

const userLinks = [
  {
    href: "/user/[userId]",
    label: "PROFILE",
    icon: <UserCircleIcon className="w-6 h-6" />,
  },
  {
    href: "/user/[userId]/story",
    label: "My STORY",
    icon: <BookOpenIcon className="w-6 h-6" />,
  },
  {
    href: "/user/[userId]/settingMaterial",
    label: "My MATERIAL",
    icon: <PhotographIcon className="w-6 h-6" />,
  },
  {
    href: "/user/[userId]/review",
    label: "My REVIEW",
    icon: <FireIcon className="w-6 h-6" />,
  },
  {
    href: "/user/[userId]/follow",
    label: "My FOLLOW",
    icon: <UserGroupIcon className="w-6 h-6" />,
  },
  {
    href: "/user/[userId]/favorite",
    label: "My FAVORITE",
    icon: <BookmarkIcon className="w-6 h-6" />,
  },
]

const HeaderComp = () => {
  const [isOpenUserAccodion, setOpenUserAccodion] = useState<boolean>(false)
  const [isOpenUserActionAccodion, setOpenUserActionAccodion] =
    useState<boolean>(false)
  const userInfo = supabase.auth.user()
  const accessToken = useMemo(() => supabase.auth.session()?.access_token, [])
  const { data: user } = useQuery<QueryMe>(Me, {
    variables: {
      accessToken,
    },
  })

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
        <div className="mr-4">
          <img
            className="w-8 h-8 rounded-full"
            src="https://avatars.githubusercontent.com/u/67810971?s=40&v=4"
            alt="avatar"
          />
        </div>

        <div className="group">
          <Menu
            viewer={
              <div className="flex items-center py-2 px-4 font-black group-hover:text-purple-400 group-hover:bg-slate-100 rounded-xl duration-200">
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
                      "py-2 px-4 w-[200px] text-lg flex font-bold items-center text-slate-600 hover:bg-slate-100 justify-between rounded-xl duration-200",
                      router.asPath === href && "bg-slate-100 text-purple-400",
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
      <div className="group flex items-center">
        <Menu
          position={-80}
          viewer={
            <div className="flex items-center py-2 px-4 font-black group-hover:bg-slate-100 rounded-xl duration-200">
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
                        <p>User Pages</p>
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
                            router.asPath === href &&
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
                      <p>User Actions</p>
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
                    className="flex justify-between items-center py-2 px-4 w-full text-lg font-bold hover:text-white hover:bg-purple-500 rounded-xl duration-200"
                    onClick={handleSignOut}
                  >
                    <p>Sign Out</p>
                    <div className="w-8">
                      <LogoutIcon className="w-8 h-8" />
                    </div>
                  </button>
                  <button
                    className="flex justify-between items-center py-2 px-4 w-full text-lg font-bold hover:text-white hover:bg-purple-500 rounded-xl duration-200"
                    onClick={handleSendResetPasswordEmail}
                  >
                    <p>Password Reset</p>
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
                  <a className="flex justify-between items-center py-2 px-4 w-full text-lg font-bold hover:text-white hover:bg-purple-500 rounded-xl duration-200">
                    <p>Login</p>
                    <div className="w-8">
                      <LoginIcon className="w-8 h-8" />
                    </div>
                  </a>
                </Link>
                <Link href="/signup">
                  <a className="flex justify-between items-center py-2 px-4 w-full text-lg font-bold hover:text-white hover:bg-purple-500 rounded-xl duration-200">
                    <p>Sign Up</p>
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
    </nav>
  )
}

export const Header = memo(HeaderComp)
