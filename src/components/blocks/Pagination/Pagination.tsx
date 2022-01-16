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

  const range = (start: number, end: number) =>
    [...Array(end - start + 1)].map((_, i) => start + i)

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

  const renderPrepage = () => {
    if (Number(nowPage()) === 5) {
      return 1
    }
    if (Number(nowPage()) === 6) {
      return 2
    }
    if (Number(nowPage()) > 6) {
      return 3
    }
  }

  return (
    <ul className="flex flex-wrap">
      {/* 最初から3ページまで */}
      {nowPage() && Number(nowPage()) > 4 && (
        <div className="flex items-center">
          {pages.slice(0, renderPrepage()).map((number, index) => (
            <li className="flex flex-col items-center mr-2" key={index}>
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
          ))}
          <p className="ml-2 text-lg font-bold text-purple-500">...</p>
        </div>
      )}
      {pages.map((number, index) => (
        <li className="flex flex-col items-center mr-2" key={index}>
          {/* nowPageから3つまでと、totalCountの-3までの間だけ表示する */}
          {nowPage() &&
            Number(nowPage()) <= number + 3 &&
            Number(nowPage()) >= number - 3 && (
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
            )}
        </li>
      ))}
      {/* 最後から3ページまで */}
      {nowPage() && Number(nowPage()) <= totalCount - 4 && (
        <div className="flex items-center">
          <p className="mr-2 text-lg font-bold text-purple-500">...</p>
          <Link href={`/${usecase}/page/${totalCount}`}>
            <a
              className={cc([
                "flex flex-col items-center py-3 px-5 rounded-xl duration-200",
                nowPage() === `${totalCount}`
                  ? "bg-purple-500 text-white"
                  : "bg-purple-200 text-purple-500 hover:bg-purple-500 hover:text-white",
              ])}
            >
              {totalCount}
            </a>
          </Link>
        </div>
      )}
    </ul>
  )
}

export const Pagination = memo(PaginationComp)
