import cc from "classcat"
import { gsap } from "gsap"
import type { ReactNode, VFC } from "react"
import { memo, useCallback, useEffect, useRef, useState } from "react"

type Props = {
  color: "purple"
  values: {
    children: ReactNode
    label: string
  }[]
}
type TabChildren = {
  children: ReactNode
  isActive: boolean
}

const TabComp: VFC<Props> = ({ color, values }) => {
  const [isActive, setIsActive] = useState<number>(0)
  const onClick = useCallback(
    (index: number) => {
      setIsActive(index)
    },
    [setIsActive]
  )

  return (
    <div className="flex justify-start items-center w-full">
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-wrap gap-2 items-center p-2 rounded-lg">
          {values.map((item, index) => {
            return (
              <button
                key={index}
                className={cc([
                  "flex justify-center items-center px-3  xs:px-4 py-2 md:text-xl text-base font-semibold duration-200",
                  color === "purple" && "bg-purple-500 text-white rounded-full",
                  isActive !== index &&
                    color === "purple" &&
                    "bg-purple-100 text-purple-500/100 rounded-full",
                ])}
                onClick={() => {
                  return onClick(index)
                }}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        <div className="w-full">
          {values.map((props, index) => {
            return (
              <div
                key={index}
                className={cc([
                  "w-full h-full",
                  isActive === index ? "block" : "hidden",
                ])}
              >
                <TabChildren isActive={isActive === index}>
                  {props.children}
                </TabChildren>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const TabChildrenComp: VFC<TabChildren> = ({ children, isActive }) => {
  const [timeline] = useState(gsap.timeline({ paused: true }))
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      timeline.from(ref.current.children, {
        y: 100,
        opacity: 0,
        display: "none",
        // ease: "power4.inOut",
        ease: "back.out(1.5)",
        duration: 0.5,
      })
    }
  }, [timeline])

  useEffect(() => {
    if (isActive) {
      timeline.play()
    } else {
      timeline.reverse()
    }
  }, [isActive, timeline])

  return <div ref={ref}>{children}</div>
}

export const Tab = memo(TabComp)
const TabChildren = memo(TabChildrenComp)
