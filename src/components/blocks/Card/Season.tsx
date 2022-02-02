/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import type { VFC } from "react"
import { memo } from "react"
import type { NexusGenFieldTypes } from "src/generated/nexus-typegen"

const SeasonCardComp: VFC<
  NexusGenFieldTypes["Season"] & {
    seasonNumber: number
  }
> = ({ id, season_image, season_title, seasonNumber, story_id }) => (
  <article
    className="group overflow-hidden relative w-[300px] h-[200px] bg-center bg-cover rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out"
    style={{
      backgroundImage: `url(${
        season_image ||
        "https://user-images.githubusercontent.com/67810971/149643400-9821f826-5f9c-45a2-a726-9ac1ea78fbe5.png"
      })`,
    }}
  >
    <div className="absolute inset-0 bg-black/50 group-hover:opacity-75 transition duration-300 ease-in-out"></div>
    <div className="flex relative flex-col justify-between p-2 w-full h-full">
      <div className="font-semibold text-white">シーズン {seasonNumber}</div>
      <div>
        <h3 className="text-left">
          <Link
            prefetch={false}
            href={{
              pathname: "/story/[storyId]/season/[seasonId]",
              query: { seasonId: id, storyId: story_id },
            }}
          >
            <a className="font-bold text-center text-white sm:text-xl">
              <span className="absolute inset-0"></span>
              {season_title && season_title.length > 20
                ? season_title.slice(0, 20) + "..."
                : season_title}
            </a>
          </Link>
        </h3>
      </div>
    </div>
  </article>
)

export const SeasonCard = memo(SeasonCardComp)
