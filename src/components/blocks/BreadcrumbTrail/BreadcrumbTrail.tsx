/* eslint-disable import/no-default-export */
import cc from "classcat"
import Link from "next/link"
import router from "next/router"
import type { VFC } from "react"
import { memo, useCallback, useRef, useState } from "react"

type Props = {
  separator: "›" | "-" | ">" | "/"
  breadcrumbs: {
    href: string
    label: string
  }[]
}

export const BreadcrumbTrail: VFC<Props> = ({ breadcrumbs, separator }) => {
  const [isHover, setIsHover] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement>(null)

  const onMouseEnter = useCallback(() => {
    setIsHover(true)
  }, [setIsHover])

  const onMouseLeave = useCallback(() => {
    setIsHover(false)
  }, [setIsHover])

  const isActive = (currentPath: string) => {
    const isSame = router.asPath === currentPath

    if (router.asPath === "/") {
      return false
    }
    return isSame
  }

  return (
    <div
      className={cc([
        "flex font-mono flex-wrap items-center w-full bg-purple-50 px-4 shadow-lg",
        isHover && "text-purple-500",
      ])}
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <Link key={index} href={breadcrumb.href} prefetch={false}>
            <a
              className={cc([
                "flex items-center justify-center mr-2 py-2 text-base font-semibold duration-200 hover:underline",
                isActive(breadcrumb.href)
                  ? "text-purple-500"
                  : "text-slate-500",
                isHover && "text-purple-500",
              ])}
            >
              {breadcrumb.href === "/" ? (
                <span>ホーム</span>
              ) : (
                <p className="flex items-center">
                  {breadcrumb.label}
                  <span className="ml-2">{separator}</span>
                </p>
              )}
            </a>
          </Link>
        )
      })}
    </div>
  )
}

export default memo(BreadcrumbTrail)
