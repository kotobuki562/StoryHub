/* eslint-disable @next/next/no-img-element */
/* eslint-disable import/no-default-export */
import { gql } from "@apollo/client"
import { InboxInIcon } from "@heroicons/react/outline"
import type { NextPage } from "next"
import { useMemo } from "react"
import { Toaster } from "react-hot-toast"
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

const InboxPage: NextPage = () => {
  const accessToken = supabase.auth.session()?.access_token
  const { data, mutate } = useSwrQuery<QueryNotificationsForUser>(
    NotificationQuery,
    {
      accessToken,
    }
  )

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

  return (
    <Layout>
      <Toaster position="top-center" />
      <div className="flex items-center px-4 text-3xl font-black text-purple-500">
        <InboxInIcon className="mr-2 w-8 h-8" />
        <h2 className="">Inbox</h2>
      </div>

      <Tab
        color="purple"
        values={[
          {
            label: "All",
            children: (
              <div className="grid grid-cols-1">
                {notifications.map(noti => {
                  return (
                    <NotificationCard
                      mutate={mutate}
                      accessToken={accessToken || ""}
                      notification={noti}
                      key={noti.id}
                    />
                  )
                })}
              </div>
            ),
          },
          {
            label: "Reviews",
            children: (
              <pre>{JSON.stringify(notificationsByRebiew, null, 2)}</pre>
            ),
          },
          {
            label: "Favorites",
            children: (
              <pre>{JSON.stringify(notificationsByFavorite, null, 2)}</pre>
            ),
          },
          {
            label: "Follows",
            children: (
              <pre>{JSON.stringify(notificationsByFollow, null, 2)}</pre>
            ),
          },
        ]}
      />
    </Layout>
  )
}

export default InboxPage
