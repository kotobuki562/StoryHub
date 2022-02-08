/* eslint-disable @next/next/no-img-element */
import { StarIcon } from "@heroicons/react/solid"
import { BookOpenIcon, ExternalLinkIcon } from "@heroicons/react/solid"
import cc from "classcat"
import Link from "next/link"
import type { VFC } from "react"
import { memo } from "react"
import type { NexusGenFieldTypes } from "src/generated/nexus-typegen"

const reviewStars = [1, 2, 3, 4, 5]

type Star = 1 | 2 | 3 | 4 | 5

const review = {
  1: "BAD",
  2: "SOSO",
  3: "GOOD",
  4: "EXCELLENT",
  5: "WOW",
}

const ReviewCardComp: VFC<NexusGenFieldTypes["Review"]> = ({
  id,
  review_title,
  stars,
  story_id,
  user,
}) => {
  return (
    <article className="flex flex-col justify-between items-center w-[300px] h-full bg-white rounded-xl shadow-lg">
      <div className="flex justify-start items-center px-4 pt-4 mb-4 w-full text-sm sm:text-base">
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

      <div className="flex flex-col items-center mb-2">
        <p className="mb-2 font-mono text-2xl font-bold text-yellow-400">
          {review[stars as Star]}
        </p>

        <img className="w-12 h-12" src={`/img/${stars}.svg`} alt="" />
      </div>
      {stars && (
        <div className="flex gap-1 items-center mb-4">
          {reviewStars.map(star => {
            return (
              <StarIcon
                key={star}
                className={cc([
                  "w-10 h-10",
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
      <div className="flex flex-col justify-start px-4 mb-4 w-full">
        <h3 className="mb-2 font-bold text-left text-purple-500 break-all">
          {review_title}
        </h3>
      </div>

      <div className="flex items-center w-full">
        <Link
          href={{
            pathname: "/story/[storyId]",
            query: { storyId: story_id },
          }}
        >
          <a className="flex flex-col justify-center items-center py-4 w-1/2 text-purple-500 hover:text-white bg-purple-100 hover:bg-purple-500 rounded-bl-xl duration-200">
            <BookOpenIcon className="w-10 h-10" />
          </a>
        </Link>
        <Link href="/review/[reviewId]" as={`/review/${id}`}>
          <a className="flex flex-col justify-center items-center py-4 w-1/2 text-purple-500 hover:text-white bg-purple-100 hover:bg-purple-500 rounded-br-xl duration-200">
            <ExternalLinkIcon className="w-10 h-10" />
          </a>
        </Link>
      </div>
    </article>
  )
}

export const ReviewCardOrigin = memo(ReviewCardComp)
