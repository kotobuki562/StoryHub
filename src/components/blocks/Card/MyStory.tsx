/* eslint-disable @next/next/no-img-element */
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid"
import Link from "next/link"
import type { VFC } from "react"
import { memo } from "react"
import type { NexusGenFieldTypes } from "src/generated/nexus-typegen"

const MyStoryCardComp: VFC<NexusGenFieldTypes["Story"]> = ({
  id,
  publish,
  story_categories,
  story_image,
  story_title,
  user_id,
  viewing_restriction,
}) => (
  <article
    className="group overflow-hidden relative w-[210px] h-[297px] bg-center bg-cover rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out sm:w-[300.38px] sm:h-[425px] xl:w-[375px] xl:h-[530.57px]"
    style={{
      backgroundImage: `url(${
        story_image ||
        "https://user-images.githubusercontent.com/67810971/149643400-9821f826-5f9c-45a2-a726-9ac1ea78fbe5.png"
      })`,
    }}
  >
    <div className="absolute inset-0 bg-black/50 group-hover:opacity-75 transition duration-300 ease-in-out"></div>
    <div className="flex relative flex-col justify-between p-2 w-full h-full">
      <div className="flex justify-between items-center text-white">
        <div className="flex items-center text-sm sm:text-base">
          <div className="flex items-center py-1 px-2 text-purple-500 bg-yellow-300 rounded-xl">
            {publish ? (
              <EyeIcon className="mr-1 w-4 h-4" />
            ) : (
              <EyeOffIcon className="mr-1 w-4 h-4" />
            )}
            {publish ? "公開中" : "非公開"}
          </div>
        </div>
        {viewing_restriction && (
          <div>
            <p className="py-1 px-2 font-bold bg-purple-400 rounded-full">
              {viewing_restriction}
            </p>
          </div>
        )}
      </div>

      <div>
        <div className="flex flex-wrap gap-2 mb-2">
          {story_categories?.map(category => (
            <span
              className="py-1 px-2 text-sm text-purple-500 bg-yellow-300 rounded-r-full rounded-bl-full"
              key={category}
            >
              {category}
            </span>
          ))}
        </div>
        <h3 className="text-left">
          <Link
            href={{
              pathname: "/myPage/[userId]/story/[storyId]",
              query: { storyId: id, userId: user_id },
            }}
          >
            <a className="font-bold text-center text-white sm:text-xl">
              <span className="absolute inset-0"></span>
              {story_title && story_title.length > 20
                ? story_title.slice(0, 20) + "..."
                : story_title}
            </a>
          </Link>
        </h3>
      </div>
    </div>
  </article>
)

export const MyStoryCard = memo(MyStoryCardComp)
