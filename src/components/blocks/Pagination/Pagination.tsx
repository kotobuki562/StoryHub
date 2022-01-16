import cc from "classcat"
import Link from "next/link"
import { useRouter } from "next/router"
import type { VFC } from "react"
import { memo } from "react"

type PagenationInfo = {
  totalCount: number
  isCategory?: boolean
  categoryId?: string
}
export const PaginationComp: VFC<PagenationInfo> = ({
  categoryId,
  isCategory,
  totalCount,
}) => {
  const router = useRouter()
  const PER_PAGE = 6

  const range = (start: number, end: number) =>
    [...Array(end - start + 1)].map((_, i) => start + i)

  return (
    <ul className="flex flex-wrap">
      {range(1, Math.ceil(totalCount / PER_PAGE)).map((number, index) => {
        const nowPage = router.query.id
        return (
          <li className="flex flex-col items-center mr-2" key={index}>
            <Link
              href={
                isCategory
                  ? `/Articles/category/${categoryId}/page/${number}`
                  : `/Articles/page/${number}`
              }
            >
              <a
                className={cc([
                  "flex flex-col items-center py-3 px-5 rounded-xl duration-200",
                  nowPage === `${number}`
                    ? "bg-goemon dark:bg-goemonDark bg-opacity-75 dark:bg-opacity-75 hover:bg-opacity-100 dark:hover:bg-opacity-100"
                    : "bg-blueGray-100 dark:bg-blueGray-600 hover:bg-blueGray-200 dark:hover:bg-blueGray-500",
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
