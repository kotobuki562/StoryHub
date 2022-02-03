import { StarIcon } from "@heroicons/react/solid"
import { gsap } from "gsap"
import type { VFC } from "react"
import { memo, useEffect, useRef } from "react"

type StarProps = {
  isActive: boolean
}

const StarComp: VFC<StarProps> = ({ isActive }) => {
  const iconRef = useRef<HTMLDivElement>(null)
  const topRightIcon = useRef<HTMLDivElement>(null)
  const bottomLeftIcon = useRef<HTMLDivElement>(null)
  const timeline = gsap.timeline({ paused: true })

  useEffect(() => {
    if (iconRef.current) {
      timeline.from(iconRef.current, {
        opacity: 0,
        display: "none",
        scale: 0,
        ease: "back.out(3)",
        duration: 0.5,
        stagger: 0.3,
      })
    }
  }, [timeline])
  // topRightIcon.currentとbottomLeftIconを同時に発火させる
  useEffect(() => {
    if (topRightIcon.current && bottomLeftIcon.current) {
      timeline.from([topRightIcon.current, bottomLeftIcon.current], {
        opacity: 0,
        display: "none",
        scale: 0,
        ease: "back.out(3)",
        // rotate: 120,
        duration: 0.5,
        stagger: 0.3,
      })
      timeline.to(topRightIcon.current, {
        opacity: 0,
        display: "none",
        scale: 0,
        // 45度傾ける
        rotation: 0,
        ease: "back.out(3)",
        duration: 0.5,
        stagger: 0.3,
      })
      timeline.to(bottomLeftIcon.current, {
        opacity: 0,
        display: "none",
        scale: 0,
        // -45度傾ける
        rotation: 0,
        ease: "back.out(3)",
        duration: 0.5,
        stagger: 0.3,
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

  if (isActive) {
    return (
      <div className="relative" ref={iconRef}>
        <div ref={topRightIcon} className="absolute top-0">
          <div className="relative">
            <div className="absolute top-0 left-1">
              <StarIcon className="w-3 h-3 text-yellow-400 sm:w-6 sm:h-6" />
            </div>
            <div className="absolute top-0 right-1">
              <StarIcon className="w-3 h-3 text-yellow-400 sm:w-6 sm:h-6" />
            </div>

            <div className="absolute right-[3.5px] sm:right-7 sm:-bottom-20">
              <StarIcon className="w-3 h-3 text-yellow-400 sm:w-6 sm:h-6" />
            </div>
            <div className="absolute -right-1 -bottom-16">
              <StarIcon className="w-3 h-3 text-yellow-400 sm:w-6 sm:h-6" />
            </div>
            <div className="absolute -bottom-16 -left-1">
              <StarIcon className="w-3 h-3 text-yellow-400 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>
        <StarIcon className="w-12 h-12 text-yellow-400 sm:w-20 sm:h-20" />

        {/* <div ref={bottomLeftIcon} className="absolute bottom-0 -left-3 sm:-bottom-3 sm:-left-3">
          <StarIcon className="w-6 h-6 text-yellow-400 sm:w-10 sm:h-10" />
        </div> */}
      </div>
    )
  }

  return <StarIcon className="w-10 h-10 text-gray-500 sm:w-20 sm:h-20" />
}

export const Star = memo(StarComp)
