import { XCircleIcon } from "@heroicons/react/solid"
import { format } from "date-fns"
import Link from "next/link"
import type { VFC } from "react"
import type { QueryNotificationsForUser } from "src/types/Notification/query"

type Props = {
  notifications: QueryNotificationsForUser["QueryNotificationsForUser"]
  handleDelete: (id: string) => Promise<void>
  handleAllDelete: () => Promise<void>
}

export const NotificationBar: VFC<Props> = ({
  handleAllDelete,
  handleDelete,
  notifications,
}) => {
  return (
    <div className="grid relative grid-cols-1 gap-5">
      <div className="sticky top-0 z-10 bg-white">
        <button
          className="py-2 w-full font-bold text-purple-500 bg-purple-100 rounded-md"
          onClick={handleAllDelete}
        >
          {notifications.length}
          件全て既読にする
        </button>
      </div>

      {notifications.map(data => {
        return (
          <div className="group relative pb-2 border-b" key={data.id}>
            <div className="flex items-center mb-2">
              <div className="mr-2 min-w-[2rem]">
                <img
                  className="w-8 h-8 rounded-full"
                  src={data.user?.image || "/img/Vector.png"}
                  alt="avatar"
                />
              </div>
              <p className="text-xs xs:text-sm">
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
                  <div className="mr-2 min-w-[1.5rem] xs:min-w-[2rem]">
                    <img
                      className="w-[1.5rem] h-[1.5rem] rounded-full"
                      src={`/img/${data.review.stars}.svg`}
                      alt="avatar"
                    />
                  </div>
                  <p className="text-xs xs:text-sm">
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
                {format(new Date(data.created_at), "yyyy/MM/dd HH:mm")}
              </p>
            )}

            <div className="hidden group-hover:block absolute -top-5 right-0">
              <button
                className="text-sm text-purple-500"
                onClick={() => {
                  return handleDelete(data.id as string)
                }}
              >
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
