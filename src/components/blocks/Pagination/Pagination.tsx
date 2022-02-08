import cc from "classcat"
import Link from "next/link"
import { useRouter } from "next/router"
import type { VFC } from "react"
import { memo } from "react"

type PagenationInfo = {
  totalCount: number
  usecase: "story" | "review" | "settingMaterial"
  page: number
}
export const PaginationComp: VFC<PagenationInfo> = ({
  page,
  totalCount,
  usecase,
}) => {
  const router = useRouter()

  const range = (start: number, end: number) => {
    return [...Array(end - start + 1)].map((_, i) => {
      return start + i
    })
  }

  const nowPage = () => {
    switch (usecase) {
      case "story":
        return router.query.storyPageId
      case "review":
        return router.query.reviewPageId
      case "settingMaterial":
        return router.query.settingMaterialPageId
      default:
        return ""
    }
  }

  const pages = range(1, Math.ceil(totalCount / page))

  return (
    <ul className="flex flex-wrap gap-2">
      {pages.map((number, index) => {
        return (
          <li className="flex flex-col items-center" key={index}>
            <Link href={`/${usecase}/page/${number}`}>
              <a
                className={cc([
                  "flex flex-col items-center py-3 px-5 rounded-xl duration-200",
                  nowPage() === `${number}`
                    ? "bg-purple-500 text-white"
                    : "bg-purple-200 text-purple-500 hover:bg-purple-500 hover:text-white",
                ])}
              >
                {number}
              </a>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export const Pagination = memo(PaginationComp)
