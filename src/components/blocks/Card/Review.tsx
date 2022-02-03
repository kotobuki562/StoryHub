/* eslint-disable @next/next/no-img-element */
import { StarIcon } from "@heroicons/react/solid"
import cc from "classcat"
import { format } from "date-fns"
import Link from "next/link"
import type { VFC } from "react"
import { memo, useState } from "react"
import type { NexusGenFieldTypes } from "src/generated/nexus-typegen"

const reviewStars = [1, 2, 3, 4, 5]

const ReviewCardComp: VFC<NexusGenFieldTypes["Review"]> = ({
  created_at,
  id,
  review_body,
  review_title,
  stars,
  story_id,
  user,
}) => {
  const [isShowMore, setIsShowMore] = useState(false)
  return (
    <article className="flex flex-col justify-between items-center p-4 w-[300px] h-full bg-white rounded-xl shadow-lg">
      <div className="flex justify-start items-center mb-4 w-full text-sm sm:text-base">
        <div className="mr-2 min-w-[2rem] sm:min-w-[2.5rem]">
          <img
            className="object-cover object-center w-8 h-8 rounded-full sm:w-10 sm:h-10"
            src={user?.image || "/img/Vector.png"}
            alt={user?.user_name || "avatar"}
          />
        </div>
        <div>
          <p className="font-bold">{user?.user_name}</p>
        </div>
      </div>
      {stars && (
        <div className="flex gap-1 items-center mb-4">
          {reviewStars.map(star => {
            return (
              <StarIcon
                key={star}
                className={cc([
                  "w-8 h-8",
                  {
                    "text-gray-500": star > stars,
                    "text-yellow-400": star <= stars,
                  },
                ])}
              />
            )
          })}
        </div>
      )}
      <div className="flex flex-col justify-start mb-4 w-full">
        <h3 className="mb-2 text-left">
          <Link href="/review/[id]" as={`/review/${id}`}>
            <a className="font-bold text-left text-purple-500 break-all">
              {review_title}
            </a>
          </Link>
        </h3>
        <p className="text-left text-slate-600 whitespace-pre-wrap">
          {isShowMore ? review_body : review_body?.slice(0, 30)}
        </p>
        {review_body && review_body.length > 30 && (
          <button
            className="flex text-sm text-purple-300"
            onClick={() => {
              setIsShowMore(!isShowMore)
            }}
          >
            {isShowMore ? "閉じる" : "全て見る"}
          </button>
        )}
      </div>
      <Link
        href={{
          pathname: "/story/[storyId]",
          query: { storyId: story_id },
        }}
      >
        <a className="flex w-full text-purple-500 underline">
          ストーリーを見る
        </a>
      </Link>
      <div className="flex justify-end w-full">
        <p className="text-right text-slate-500">
          {created_at && format(new Date(created_at), "yyyy/MM/dd")}
        </p>
      </div>
    </article>
  )
}

export const ReviewCardOrigin = memo(ReviewCardComp)
