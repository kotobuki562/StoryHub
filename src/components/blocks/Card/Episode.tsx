/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import type { VFC } from "react"
import { memo } from "react"
import type { NexusGenFieldTypes } from "src/generated/nexus-typegen"

const EpisodeCardComp: VFC<
  NexusGenFieldTypes["Episode"] & {
    storyId: string
  }
> = ({ episode_image, episode_title, id, season_id, storyId }) => {
  return (
    <article
      className="group overflow-hidden relative w-[210px] h-[297px] bg-center bg-cover rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out sm:w-[300.38px] sm:h-[425px]"
      style={{
        backgroundImage: `url(${
          episode_image ||
          "https://user-images.githubusercontent.com/67810971/149643400-9821f826-5f9c-45a2-a726-9ac1ea78fbe5.png"
        })`,
      }}
    >
      <div className="absolute inset-0 bg-black/50 group-hover:opacity-75 transition duration-300 ease-in-out"></div>
      <div className="flex relative flex-col justify-between p-2 w-full h-full">
        <div>
          <h3 className="text-left">
            <Link
              href={{
                pathname:
                  "/story/[storyId]/season/[seasonId]/episode/[episodeId]",
                query: { episodeId: id, seasonId: season_id, storyId: storyId },
              }}
            >
              <a className="font-bold text-center text-white sm:text-xl">
                <span className="absolute inset-0"></span>
                {episode_title && episode_title.length > 20
                  ? episode_title.slice(0, 20) + "..."
                  : episode_title}
              </a>
            </Link>
          </h3>
        </div>
      </div>
    </article>
  )
}

export const EpisodeCard = memo(EpisodeCardComp)
