/* eslint-disable @next/next/no-img-element */
/* eslint-disable import/no-default-export */
import { gql } from "@apollo/client"
import type { NextPage } from "next"
import { Layout } from "src/components/Layout"
import { useSwrQuery } from "src/hooks/swr"
import { supabase } from "src/lib/supabase"
import type { QueryNotificationsForUser } from "src/types/Notification/query"

const NotificationQuery = gql`
  query QueryNotificationsForUser($accessToken: String!) {
    QueryNotificationsForUser(accessToken: $accessToken) {
      id
      notification_title
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
      review {
        id
        review_title
        stars
      }
      favorite {
        id
        story_id
        created_at
      }
      follow {
        id
        follow_id
        created_at
      }
    }
  }
`

const InboxPage: NextPage = () => {
  const accessToken = supabase.auth.session()?.access_token
  const { data } = useSwrQuery<QueryNotificationsForUser>(NotificationQuery, {
    accessToken,
  })

  // eslint-disable-next-line no-console
  console.log(data)

  return (
    <Layout>
      <div className="p-8">
        <h2 className="text-3xl font-black text-purple-500">Inbox</h2>
      </div>
      <pre>{JSON.stringify(data?.QueryNotificationsForUser, null, 2)}</pre>
    </Layout>
  )
}

export default InboxPage
