/* eslint-disable @next/next/no-img-element */
/* eslint-disable import/no-default-export */
import { gql } from "@apollo/client"
import { useMutation } from "@apollo/client"
import { EyeIcon, EyeOffIcon, InboxInIcon } from "@heroicons/react/outline"
import type { NextPage } from "next"
import router from "next/router"
import { useCallback, useMemo, useState } from "react"
import { toast } from "react-hot-toast"
import { Alert } from "src/components/atoms/Alert"
import { Button } from "src/components/atoms/Button"
import { Tab } from "src/components/blocks/Tab"
import { Layout } from "src/components/Layout"
import { useSwrQuery } from "src/hooks/swr"
import { supabase } from "src/lib/supabase"
import type { QueryNotificationsForUser } from "src/types/Notification/query"

import { NotificationCard } from "./Notification"

const NotificationQuery = gql`
  query QueryNotificationsForUser($accessToken: String!) {
    QueryNotificationsForUser(accessToken: $accessToken) {
      id
      notification_title
      receiver_id
      is_read
      review_id
      favorite_id
      follow_id
      created_at
      user {
        user_name
        image
        id
      }
    }
  }
`

const NotificationUpdate = gql`
  mutation UpdateManyNotifications(
    $accessToken: String!
    $notificationIds: [String!]!
    $isRead: Boolean!
    $receiverId: String!
  ) {
    updateManyNotifications(
      accessToken: $accessToken
      notificationIds: $notificationIds
      isRead: $isRead
      receiverId: $receiverId
    ) {
      id
    }
  }
`

const InboxPage: NextPage = () => {
  const { userId } = router.query
  const [notificationIds, setNotificationIds] = useState<string[]>([])
  const accessToken = supabase.auth.session()?.access_token
  const { data, mutate } = useSwrQuery<QueryNotificationsForUser>(
    NotificationQuery,
    {
      accessToken,
    }
  )

  const [
    updateManyNotifications,
    { loading: isLoadingUpdateManyNotifications },
  ] = useMutation(NotificationUpdate)

  const notifications = useMemo(() => {
    if (!data?.QueryNotificationsForUser) {
      return []
    }
    return data.QueryNotificationsForUser.map(notification => {
      return {
        ...notification,
      }
    })
  }, [data])

  const notificationsByRebiew = useMemo(() => {
    return (
      data?.QueryNotificationsForUser.filter(notification => {
        return notification.review_id !== null
      }) || []
    )
  }, [data?.QueryNotificationsForUser])

  const notificationsByFavorite = useMemo(() => {
    return (
      data?.QueryNotificationsForUser.filter(notification => {
        return notification.favorite_id !== null
      }) || []
    )
  }, [data?.QueryNotificationsForUser])

  const notificationsByFollow = useMemo(() => {
    return (
      data?.QueryNotificationsForUser.filter(notification => {
        return notification.follow_id !== null
      }) || []
    )
  }, [data?.QueryNotificationsForUser])

  const handleAddNotificationId = useCallback(
    (id: string) => {
      setNotificationIds(pre => {
        if (pre.includes(id)) {
          return pre
        }
        return [...pre, id]
      })
    },
    [setNotificationIds]
  )

  const handleRemoveNotificationId = useCallback(
    (id: string) => {
      setNotificationIds(pre => {
        return pre.filter(notificationId => {
          return notificationId !== id
        })
      })
    },
    [setNotificationIds]
  )

  const handleAddAll = useCallback(() => {
    setNotificationIds(pre => {
      const ids = notifications.map(notification => {
        return notification.id
      })
      const newIds = ids.filter(id => {
        return !pre.includes(id)
      })
      return [...pre, ...newIds]
    })
  }, [notifications])

  const handleRemoveAll = useCallback(() => {
    setNotificationIds([])
  }, [])

  const handleUpdateManyNotifications = useCallback(
    async (isRead: boolean) => {
      if (notificationIds.length === 0) {
        return
      }
      await updateManyNotifications({
        variables: {
          accessToken,
          notificationIds,
          isRead: isRead,
          receiverId: userId as string,
        },
      })
        .then(() => {
          setNotificationIds([])
          mutate()
          toast.custom(t => {
            return (
              <Alert
                t={t}
                usage="success"
                title="通知を更新しました"
                message={isRead ? "既読にしました" : "未読にしました"}
              />
            )
          })
        })
        .catch(error => {
          mutate()
          return toast.custom(t => {
            return (
              <Alert
                t={t}
                usage="error"
                title="通知の更新に失敗しました"
                message={error.message}
              />
            )
          })
        })
    },
    [notificationIds, updateManyNotifications, accessToken, userId, mutate]
  )

  return (
    <Layout>
      <div className="flex items-center px-4 mb-4 text-3xl font-black text-purple-500">
        <InboxInIcon className="mr-2 w-8 h-8" />
        <h2 className="">Inbox</h2>
      </div>
      <div className="flex flex-wrap gap-3 items-center px-4 mb-4">
        <div>
          <Button primary onClick={handleAddAll} usage="base" text="全て選択" />
        </div>
        <div>
          <Button
            primary
            onClick={handleRemoveAll}
            usage="base"
            text="全て解除"
          />
        </div>
        {notificationIds.length > 0 && (
          <>
            <div>
              <Button
                primary
                disabled={isLoadingUpdateManyNotifications}
                isLoading={isLoadingUpdateManyNotifications}
                onClick={() => {
                  return handleUpdateManyNotifications(true)
                }}
                icon={<EyeIcon className="mr-2 w-5 h-5" />}
                usage="base"
                text="全て既読にする"
              />
            </div>
            <div>
              <Button
                primary
                disabled={isLoadingUpdateManyNotifications}
                isLoading={isLoadingUpdateManyNotifications}
                onClick={() => {
                  return handleUpdateManyNotifications(false)
                }}
                icon={<EyeOffIcon className="mr-2 w-5 h-5" />}
                usage="base"
                text="全て未読にする"
              />
            </div>
            <div>
              <Button
                primary
                onClick={handleRemoveAll}
                usage="reject"
                text="全て解除"
              />
            </div>
          </>
        )}
      </div>

      <Tab
        color="purple"
        values={[
          {
            label: "All",
            children:
              notifications.length > 0 ? (
                <div className="grid grid-cols-1">
                  {notifications.map(noti => {
                    return (
                      <NotificationCard
                        notificatonIds={notificationIds}
                        onRemove={handleRemoveNotificationId}
                        onAdd={handleAddNotificationId}
                        mutate={mutate}
                        accessToken={accessToken || ""}
                        notification={noti}
                        key={noti.id}
                      />
                    )
                  })}
                </div>
              ) : (
                <div>
                  <p className="text-center text-gray-500">通知はありません</p>
                </div>
              ),
          },
          {
            label: "Reviews",
            children:
              notificationsByRebiew.length > 0 ? (
                <div className="grid grid-cols-1">
                  {notificationsByRebiew.map(noti => {
                    return (
                      <NotificationCard
                        notificatonIds={notificationIds}
                        onRemove={handleRemoveNotificationId}
                        onAdd={handleAddNotificationId}
                        mutate={mutate}
                        accessToken={accessToken || ""}
                        notification={noti}
                        key={noti.id}
                      />
                    )
                  })}
                </div>
              ) : (
                <div>
                  <p className="text-center text-gray-500">
                    レビュー通知はありません
                  </p>
                </div>
              ),
          },
          {
            label: "Bookmarks",
            children:
              notificationsByFavorite.length > 0 ? (
                <div className="grid grid-cols-1">
                  {notificationsByFavorite.map(noti => {
                    return (
                      <NotificationCard
                        notificatonIds={notificationIds}
                        onRemove={handleRemoveNotificationId}
                        onAdd={handleAddNotificationId}
                        mutate={mutate}
                        accessToken={accessToken || ""}
                        notification={noti}
                        key={noti.id}
                      />
                    )
                  })}
                </div>
              ) : (
                <div>
                  <p className="text-center text-gray-500">
                    ブックマークした通知はありません
                  </p>
                </div>
              ),
          },
          {
            label: "Follows",
            children:
              notificationsByFollow.length > 0 ? (
                <div className="grid grid-cols-1">
                  {notificationsByFollow.map(noti => {
                    return (
                      <NotificationCard
                        notificatonIds={notificationIds}
                        onRemove={handleRemoveNotificationId}
                        onAdd={handleAddNotificationId}
                        mutate={mutate}
                        accessToken={accessToken || ""}
                        notification={noti}
                        key={noti.id}
                      />
                    )
                  })}
                </div>
              ) : (
                <div>
                  <p className="text-center text-gray-500">
                    フォローされた通知はありません
                  </p>
                </div>
              ),
          },
        ]}
      />
    </Layout>
  )
}

export default InboxPage
