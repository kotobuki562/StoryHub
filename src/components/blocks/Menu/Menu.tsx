/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import gsap from "gsap"
import type { ReactNode, VFC } from "react"
import { memo, useEffect, useMemo, useRef } from "react"

type Props = {
  children: ReactNode
  viewer: ReactNode
  position?: number
  isHidden: boolean
  onToggle: () => void
  onClose: () => void
}

// hoverするとhiddenからblockになるPopverコンポーネントをtailwindCSSで実装
// eslint-disable-next-line react/display-name
export const Menu: VFC<Props> = memo(
  ({ children, isHidden, onClose, onToggle, position, viewer }) => {
    const popoverRef = useRef<HTMLDivElement>(null)
    const timeline = useMemo(() => {
      return gsap.timeline({ paused: true })
    }, [])

    useEffect(() => {
      if (popoverRef.current) {
        timeline.from(popoverRef.current.children, {
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

    // const onHover = useCallback(() => {
    //   setHidden(false)
    // }, [])

    // const onLeave = useCallback(() => {
    //   setHidden(true)
    // }, [])

    return (
      <div className="relative cursor-pointer">
        <button
          onClick={onToggle}
          type="button"
          // onMouseEnter={onHover}
          // onMouseLeave={onLeave}
          className="flex flex-col items-center"
        >
          {viewer}
        </button>
        {!isHidden && (
          <div onClick={onClose} className="fixed inset-0 z-10 bg-black/0" />
        )}

        <div
          // onMouseEnter={onHover}
          // onMouseLeave={onLeave}
          ref={popoverRef}
        >
          <div
            className="overflow-y-scroll absolute z-10 bg-white rounded-lg shadow-lg"
            style={{
              top: "120%",
              left: "50%",
              transform: `${
                position ? `translateX(${position}%)` : "translateX(-50%)"
              }`,
              width: "max-content",
              height: "max-content",
            }}
          >
            <div className="overscroll-contain w-full">{children}</div>
          </div>
        </div>
      </div>
    )
  }
)
