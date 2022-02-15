/* eslint-disable @next/next/no-img-element */
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid"
import Link from "next/link"
import type { VFC } from "react"
import { memo } from "react"
import type { NexusGenFieldTypes } from "src/generated/nexus-typegen"

const MyEpisodeCardComp: VFC<
  NexusGenFieldTypes["Episode"] & {
    episodeNumber: number
    href: string
  }
> = ({ episode_image, episode_title, episodeNumber, href, publish }) => {
  return (
    <article
      className="group overflow-hidden relative w-[300px] h-[200px] bg-center bg-cover rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out"
      style={{
        backgroundImage: `url(${
          episode_image ||
          "https://user-images.githubusercontent.com/67810971/149643400-9821f826-5f9c-45a2-a726-9ac1ea78fbe5.png"
        })`,
      }}
    >
      <div className="absolute inset-0 bg-black/50 group-hover:opacity-75 transition duration-300 ease-in-out"></div>
      <div className="flex relative flex-col justify-between p-2 w-full h-full">
        <div className="flex justify-between items-center text-sm sm:text-base">
          <div className="flex items-center py-1 px-2 text-purple-500 bg-yellow-300 rounded-xl">
            {publish ? (
              <EyeIcon className="mr-1 w-4 h-4" />
            ) : (
              <EyeOffIcon className="mr-1 w-4 h-4" />
            )}
            {publish ? "公開中" : "非公開"}
          </div>
          <div className="font-semibold text-white">
            エピソード {episodeNumber}
          </div>
        </div>

        <div>
          <h3 className="text-left">
            <Link href={href}>
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

export const MyEpisodeCard = memo(MyEpisodeCardComp)
