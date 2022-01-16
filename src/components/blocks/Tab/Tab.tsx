import cc from "classcat"
import { gsap } from "gsap"
import type { ReactNode, VFC } from "react"
import { memo, useCallback, useEffect, useRef, useState } from "react"

type Props = {
  color: "agree" | "delete" | "yellow" | "blue" | "purple" | "other"
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
        <div className="flex p-2 rounded-lg">
          {values.map((item, index) => (
            <button
              key={index}
              className={cc([
                "flex justify-center items-center px-4 mr-2 py-2 md:text-xl text-base font-semibold duration-200",
                isActive === index &&
                  color === "blue" &&
                  "text-blue-500 border-blue-500 border-b-2 bg-blue-100 rounded-t-lg",
                isActive !== index &&
                  color === "blue" &&
                  "text-blue-500 border-blue-500 border-b-2",
                isActive === index &&
                  color === "agree" &&
                  "text-teal-500 border-teal-500 border-b-2 bg-teal-100 rounded-t-lg",
                isActive !== index &&
                  color === "agree" &&
                  "text-teal-500 border-teal-500 border-b-2",
                isActive === index &&
                  color === "yellow" &&
                  "text-yellow-500 border-yellow-500 border-b-2 bg-yellow-100 rounded-t-lg",
                isActive !== index &&
                  color === "yellow" &&
                  "text-yellow-500 border-yellow-500 border-b-2",
                isActive === index &&
                  color === "delete" &&
                  "text-red-500 border-red-500 border-b-2 bg-red-100 rounded-t-lg",
                isActive !== index &&
                  color === "delete" &&
                  "text-red-500 border-red-500 border-b-2",
                isActive === index &&
                  color === "purple" &&
                  "text-purple-500 border-purple-500 border-b-2 bg-purple-100 rounded-t-lg",
                isActive !== index &&
                  color === "purple" &&
                  "text-purple-500 border-purple-500 border-b-2",
                isActive === index &&
                  color === "other" &&
                  "text-blueGray-800 border-blueGray-800 border-b-2 bg-blueGray-200 rounded-t-lg",
                isActive !== index &&
                  color === "other" &&
                  "text-blueGray-800 border-blueGray-800 border-b-2",
              ])}
              onClick={() => onClick(index)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="w-full">
          {values.map((props, index) => (
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
          ))}
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
        ease: "power4.inOut",
        // ease: "back.out(3.05)",
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
