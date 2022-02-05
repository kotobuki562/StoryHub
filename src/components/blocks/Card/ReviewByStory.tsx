/* eslint-disable @next/next/no-img-element */
import { StarIcon } from "@heroicons/react/solid"
import cc from "classcat"
import { format } from "date-fns"
import Link from "next/link"
import type { VFC } from "react"
import { memo } from "react"
import type { NexusGenFieldTypes } from "src/generated/nexus-typegen"

const reviewStars = [1, 2, 3, 4, 5]

const ReviewCardComp: VFC<NexusGenFieldTypes["Review"]> = ({
  created_at,
  id,
  review_title,
  stars,
  user,
}) => {
  return (
    <article className="flex flex-col justify-between items-center p-4 w-full h-full bg-white">
      <div className="flex justify-start items-center mb-2 w-full text-sm sm:text-base">
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
      <div className="flex flex-col justify-start mb-2 w-full">
        <h3 className="mb-2 text-left">
          <Link href="/review/[id]" as={`/review/${id}`}>
            <a className="text-left break-all">{review_title}</a>
          </Link>
        </h3>

        {stars && (
          <div className="flex gap-1 items-center">
            {reviewStars.map(star => {
              return (
                <StarIcon
                  key={star}
                  className={cc([
                    "sm:w-8 sm:h-8 w-6 h-6",
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
      </div>
      <div className="flex justify-end w-full">
        <p className="text-right text-slate-500">
          {created_at && format(new Date(created_at), "yyyy/MM/dd")}
        </p>
      </div>
    </article>
  )
}

export const ReviewCard = memo(ReviewCardComp)
