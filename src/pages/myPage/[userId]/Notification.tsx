/* eslint-disable @next/next/no-img-element */
import { gql } from "@apollo/client"
import { useMutation } from "@apollo/client"
import {
  BookmarkIcon,
  CheckIcon,
  DotsCircleHorizontalIcon,
  EyeIcon,
  EyeOffIcon,
  FireIcon,
  TrashIcon,
  UserGroupIcon,
} from "@heroicons/react/outline"
import cc from "classcat"
import { format } from "date-fns"
import Link from "next/link"
import type { VFC } from "react"
import { memo, useCallback, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { Alert } from "src/components/atoms/Alert"
import { Menu } from "src/components/blocks/Menu"
import type { NexusGenFieldTypes } from "src/generated/nexus-typegen"
import type { QueryNotificationsForUser } from "src/types/Notification/query"
import type { KeyedMutator } from "swr"

const NotificationUpdate = gql`
  mutation Mutation(
    $accessToken: String!
    $notificationId: String!
    $isRead: Boolean!
    $receiverId: String!
  ) {
    updateNotification(
      accessToken: $accessToken
      notificationId: $notificationId
      isRead: $isRead
      receiverId: $receiverId
    ) {
      id
    }
  }
`

type Props = {
  notification: NexusGenFieldTypes["Notification"]
  accessToken: string
  mutate: KeyedMutator<QueryNotificationsForUser>
  notificatonIds: string[]
  onAdd: (id: string) => void
  onRemove: (id: string) => void
}

const NotificationCardComp: VFC<Props> = ({
  accessToken,
  mutate,
  notification,
  notificatonIds,
  onAdd,
  onRemove,
}) => {
  const [isHidden, setIsHidden] = useState(true)
  const isIncldued = useMemo(() => {
    return notificatonIds.includes(notification.id)
  }, [notification.id, notificatonIds])

  const handleToggle = useCallback(() => {
    setIsHidden(pre => {
      return !pre
    })
  }, [])

  const handleClose = useCallback(() => {
    setIsHidden(true)
  }, [])

  const [updateNotification, { loading: isLoadingUpdateNotification }] =
    useMutation(NotificationUpdate)

  const handleUpdate = useCallback(
    async (isRead: boolean) => {
      await updateNotification({
        variables: {
          accessToken: accessToken,
          notificationId: notification.id,
          isRead: isRead,
          receiverId: notification.receiver_id,
        },
      })
        .then(() => {
          mutate()
          return toast.custom(t => {
            return <Alert t={t} title="通知を更新しました" usage="success" />
          })
        })
        .catch(error => {
          return toast.custom(t => {
            return (
              <Alert
                t={t}
                title="通知を更新できませんでした"
                usage="error"
                message={error.message}
              />
            )
          })
        })
    },
    [
      accessToken,
      mutate,
      notification.id,
      notification.receiver_id,
      updateNotification,
    ]
  )

  return (
    <div
      key={notification.id}
      className={cc([
        "group flex relative p-2 hover:bg-purple-50 border-b xs:p-4",
        !notification.is_read && "bg-purple-50",
      ])}
    >
      <div className="hidden group-hover:block absolute top-0 left-0 w-[4px] h-full bg-purple-500" />
      {!notification.is_read && (
        <div className="absolute top-0 left-0 w-[4px] h-full bg-purple-500" />
      )}
      <div className="hidden group-hover:block absolute top-1 right-3 xs:top-3 xs:right-3">
        <Menu
          position={-90}
          onToggle={handleToggle}
          onClose={handleClose}
          isHidden={isHidden}
          viewer={
            <DotsCircleHorizontalIcon className="w-8 h-8 text-purple-500" />
          }
        >
          <div className="p-2 w-full h-full">
            <div className="flex flex-col">
              {notification.is_read ? (
                <button
                  onClick={() => {
                    return handleUpdate(false)
                  }}
                  disabled={isLoadingUpdateNotification}
                  className="flex items-center py-1 px-2 font-semibold text-white bg-purple-500 rounded-md"
                >
                  <EyeOffIcon className="mr-1 w-5 h-5" />
                  未読にする
                </button>
              ) : (
                <button
                  onClick={() => {
                    return handleUpdate(true)
                  }}
                  disabled={isLoadingUpdateNotification}
                  className="flex items-center py-1 px-2 font-semibold text-white bg-purple-500 rounded-md"
                >
                  <EyeIcon className="mr-1 w-5 h-5" />
                  既読にする
                </button>
              )}

              <button
                disabled={isLoadingUpdateNotification}
                className="flex items-center py-1 px-2 mt-2 font-semibold text-white bg-red-500 rounded-md"
              >
                <TrashIcon className="mr-1 w-5 h-5" />
                削除する
              </button>
            </div>
          </div>
        </Menu>
      </div>
      <div className="flex flex-col items-center px-2 xs:px-0 xs:mr-2">
        <div className="mb-2 w-7 sx:w-8 text-purple-500">
          {notification.review_id && <FireIcon className="w-7 sx:w-8" />}
          {notification.favorite_id && <BookmarkIcon className="w-7 sx:w-8" />}
          {notification.follow_id && <UserGroupIcon className="w-7 sx:w-8" />}
        </div>
        {isIncldued ? (
          <button
            className="bg-purple-500 rounded-md"
            onClick={() => {
              return onRemove(notification.id)
            }}
          >
            <CheckIcon className="w-5 h-5 text-white" />
          </button>
        ) : (
          <button
            className="bg-white rounded-md ring-2 ring-purple-500"
            onClick={() => {
              return onAdd(notification.id)
            }}
          >
            <div className="w-5 h-5" />
          </button>
        )}
      </div>

      <div>
        <div
          className={cc([
            "flex items-center mb-2",
            !notification.is_read
              ? "text-slate-800 font-semibold"
              : "text-slate-500",
          ])}
        >
          <div className="mr-2 min-w-[1.5rem] xs:min-w-[2rem]">
            <img
              className="object-cover object-center w-6 h-6 rounded-full xs:w-8 xs:h-8"
              src={notification.user?.image || "/img/Vector.png"}
              alt={notification.user?.user_name || "avatar"}
            />
          </div>
          <p>{notification.user?.user_name || "User"}</p>
        </div>

        {notification.review_id ? (
          <Link
            href={{
              pathname: "/review/[id]",
              query: {
                id: notification.review_id,
              },
            }}
          >
            <a
              className={cc([
                "mb-2 text-sm block group-hover:text-purple-500 break-all",
                !notification.is_read && "text-purple-500 font-semibold",
              ])}
            >
              {notification.notification_title}
            </a>
          </Link>
        ) : (
          <p
            className={cc([
              "mb-2 text-sm group-hover:text-purple-500 break-all",
              !notification.is_read && "text-purple-500 font-semibold",
            ])}
          >
            {notification.notification_title}
          </p>
        )}

        {notification.created_at && (
          <p className="font-mono text-xs text-gray-500">
            {format(new Date(notification.created_at), "yyyy/MM/dd HH:mm")}
          </p>
        )}
      </div>
    </div>
  )
}

export const NotificationCard = memo(NotificationCardComp)
