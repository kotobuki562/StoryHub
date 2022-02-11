/* eslint-disable @next/next/no-img-element */
import {
  BookmarkIcon,
  BookOpenIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FireIcon,
  LogoutIcon,
  MailIcon,
  PencilIcon,
  PhotographIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/solid"
import type { User } from "@supabase/supabase-js"
import cc from "classcat"
import Link from "next/link"
import router from "next/router"
import type { VFC } from "react"
import { useCallback, useState } from "react"
import { Accordion } from "src/components/blocks/Accodion"
import type { NexusGenObjects } from "src/generated/nexus-typegen"
import { supabase } from "src/lib/supabase"
import type { GoogleAccount } from "src/types/User/shcame"

type Props = {
  user?: NexusGenObjects["User"]
  google: GoogleAccount["user_metadata"]
  userInfo: User
}

export const UserBar: VFC<Props> = ({ google, user, userInfo }) => {
  const [isOpenUserAccodion, setOpenUserAccodion] = useState<boolean>(false)
  const [isOpenUserActionAccodion, setOpenUserActionAccodion] =
    useState<boolean>(false)
  const [isOpenUserStoryAccordion, setOpenUserStoryAccordion] =
    useState<boolean>(false)
  const [isOpenUserSettingMaterial, setOpenUserSettingMaterial] =
    useState<boolean>(false)

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

  const handleSignOut = useCallback(() => {
    supabase.auth.signOut().then(() => {
      router.push("/signin")
    })
  }, [])

  const handleSendResetPasswordEmail = useCallback(() => {
    supabase.auth.api.resetPasswordForEmail(`${userInfo.email}`)
  }, [userInfo.email])

  const userLinks = [
    {
      href: `/myPage/${userInfo.id}/review`,
      label: "レビュー",
      icon: <FireIcon className="w-6 h-6" />,
    },
    {
      href: `/myPage/${userInfo.id}/follow`,
      label: "フォロー",
      icon: <UserGroupIcon className="w-6 h-6" />,
    },
    {
      href: `/myPage/${userInfo.id}/favorite`,
      label: "ブックマーク",
      icon: <BookmarkIcon className="w-6 h-6" />,
    },
    {
      href: `/myPage/${userInfo.id}/contents`,
      label: "コンテンツ",
      icon: <PhotographIcon className="w-6 h-6" />,
    },
  ]

  const userStoryLinks = [
    {
      href: `/myPage/${userInfo.id}/story`,
      label: "一覧で見る",
      icon: <BookOpenIcon className="w-6 h-6" />,
    },
    {
      href: `/myPage/${userInfo.id}/story/create`,
      label: "作成する",
      icon: <PencilIcon className="w-6 h-6" />,
    },
  ]

  const userSettingMaterialLinks = [
    {
      href: `/myPage/${userInfo.id}/settingMaterial`,
      label: "一覧で見る",
      icon: <PhotographIcon className="w-6 h-6" />,
    },
    {
      href: `/myPage/${userInfo.id}/settingMaterial/create`,
      label: "作成する",
      icon: <PencilIcon className="w-6 h-6" />,
    },
  ]
  return (
    <>
      <div className="sticky top-0 z-10 py-2 px-4 mb-4 bg-white border-b border-slate-200">
        <p className="mb-2 text-sm text-slate-400">ログイン中のアカウント:</p>
        <div className="flex">
          <div className="mr-2 min-w-[2rem] xs:min-w-[40px]">
            <img
              className="w-8 h-8 rounded-full xs:w-10 xs:h-10"
              src={user?.image || google.avatar_url || "/img/Vector.png"}
              alt={user?.user_name || google.full_name || "avatar"}
            />
          </div>
          <div className="overflow-scroll no-scrollbar">
            <p className="text-sm font-bold xs:text-base">
              {user?.user_name || google.full_name}
            </p>
            <p className="text-sm text-slate-400">{userInfo.email}</p>
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
                "py-2 px-4 w-full flex font-bold items-center bg-slate-100 hover:bg-slate-100 hover:text-purple-400 justify-between rounded-xl duration-200",
                isOpenUserAccodion && "text-purple-400",
              ])}
            >
              <p>ユーザーコンテンツ</p>
              <div className="w-6 xs:w-8">
                {isOpenUserAccodion ? (
                  <ChevronUpIcon className="w-6 h-6" />
                ) : (
                  <ChevronDownIcon className="w-6 h-6" />
                )}
              </div>
            </div>
          }
        >
          <Link href={`/myPage/${userInfo.id}/profile`}>
            <a
              className={cc([
                "py-2 px-4 w-full flex font-bold items-center text-slate-600 hover:bg-slate-100 hover:text-purple-400 justify-between rounded-xl duration-200",
                router.pathname === `/myPage/${userInfo.id}/profile` &&
                  "bg-slate-100 text-purple-400",
              ])}
            >
              <p>プロフィール</p>
              <div className="w-6 xs:w-8">
                <UserCircleIcon className="w-6 h-6" />
              </div>
            </a>
          </Link>

          {userLinks.map(({ href, icon, label }) => {
            return (
              <Link key={label} href={href}>
                <a
                  className={cc([
                    "py-2 px-4 w-full flex font-bold items-center text-slate-600 hover:bg-slate-100 hover:text-purple-400 justify-between rounded-xl duration-200",
                    router.pathname === href && "bg-slate-100 text-purple-400",
                  ])}
                >
                  <p>{label}</p>
                  <div className="w-6 xs:w-8">{icon}</div>
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
                "py-2 px-4 w-full flex font-bold items-center bg-slate-100 hover:bg-slate-100 hover:text-purple-400 justify-between rounded-xl duration-200",
                isOpenUserStoryAccordion && "text-purple-400",
              ])}
            >
              <p>ストーリー</p>
              <div className="w-6 xs:w-8">
                {isOpenUserStoryAccordion ? (
                  <ChevronUpIcon className="w-6 h-6" />
                ) : (
                  <ChevronDownIcon className="w-6 h-6" />
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
                    "py-2 px-4 w-full flex font-bold items-center text-slate-600 hover:bg-slate-100 hover:text-purple-400 justify-between rounded-xl duration-200",
                    router.pathname === href && "bg-slate-100 text-purple-400",
                  ])}
                >
                  <p>{label}</p>
                  <div className="w-6 xs:w-8">{icon}</div>
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
                "py-2 px-4 w-full flex font-bold items-center bg-slate-100 hover:bg-slate-100 hover:text-purple-400 justify-between rounded-xl duration-200",
                isOpenUserSettingMaterial && "text-purple-400",
              ])}
            >
              <p>設定資料</p>
              <div className="w-6 xs:w-8">
                {isOpenUserSettingMaterial ? (
                  <ChevronUpIcon className="w-6 h-6" />
                ) : (
                  <ChevronDownIcon className="w-6 h-6" />
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
                    "py-2 px-4 w-full flex font-bold items-center text-slate-600 hover:bg-slate-100 hover:text-purple-400 justify-between rounded-xl duration-200",
                    router.pathname === href && "bg-slate-100 text-purple-400",
                  ])}
                >
                  <p>{label}</p>
                  <div className="w-6 xs:w-8">{icon}</div>
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
              "py-2 px-4 w-full flex font-bold bg-slate-100 items-center hover:bg-slate-100 hover:text-purple-400 justify-between rounded-xl duration-200",
              isOpenUserActionAccodion && "text-purple-400",
            ])}
          >
            <p>その他</p>
            <div className="w-6 xs:w-8">
              {isOpenUserActionAccodion ? (
                <ChevronUpIcon className="w-6 h-6" />
              ) : (
                <ChevronDownIcon className="w-6 h-6" />
              )}
            </div>
          </div>
        }
      >
        <button
          className="flex justify-between items-center py-2 px-4 w-full font-bold hover:text-yellow-400 hover:bg-purple-500 rounded-xl duration-200"
          onClick={handleSignOut}
        >
          <p>ログアウト</p>
          <div className="w-6 xs:w-8">
            <LogoutIcon className="w-6 h-6" />
          </div>
        </button>
        <button
          className="flex justify-between items-center py-2 px-4 w-full font-bold hover:text-yellow-400 hover:bg-purple-500 rounded-xl duration-200"
          onClick={handleSendResetPasswordEmail}
        >
          <p>パスワードリセット</p>
          <div className="w-6 xs:w-8">
            <MailIcon className="w-6 h-6" />
          </div>
        </button>
      </Accordion>
    </>
  )
}
