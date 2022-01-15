/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import gsap from "gsap"
import type { ReactNode, VFC } from "react"
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"

type Props = {
  children: ReactNode
  viewer: ReactNode
  position?: number
}

// hoverするとhiddenからblockになるPopverコンポーネントをtailwindCSSで実装
// eslint-disable-next-line react/display-name
export const Menu: VFC<Props> = memo(({ children, position, viewer }) => {
  const [isHidden, setHidden] = useState<boolean>(true)
  const popoverRef = useRef<HTMLDivElement>(null)
  const timeline = useMemo(() => gsap.timeline({ paused: true }), [])
  const handleClick = useCallback(() => {
    setHidden(pre => !pre)
  }, [])
  const handleMouseOver = useCallback(() => {
    setHidden(false)
  }, [])
  const handleMouseOut = useCallback(() => {
    setHidden(true)
  }, [])

  useEffect(() => {
    if (popoverRef.current) {
      timeline.from(popoverRef.current.childNodes, {
        y: 50,
        opacity: 0,
        display: "none",
        ease: "power4.inOut",
        duration: 0.2,
        stagger: 0.1,
      })
    }
  }, [timeline])

  useEffect(() => {
    if (!isHidden) {
      timeline.play()
    } else {
      timeline.reverse()
    }
  }, [isHidden, timeline])

  return (
    <div className="relative cursor-pointer">
      <div
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        className="flex flex-col items-center"
      >
        {viewer}
      </div>

      <div
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        ref={popoverRef}
      >
        <div
          className={`absolute z-10 bg-white rounded-lg shadow-lg`}
          style={{
            top: "100%",
            left: "50%",
            transform: `${
              position ? `translateX(${position}%)` : "translateX(-50%)"
            }`,
            width: "max-content",
            padding: "10px",
          }}
        >
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  )
})
