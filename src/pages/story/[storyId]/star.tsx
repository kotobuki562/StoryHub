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
    if (topRightIcon.current) {
      timeline.from([topRightIcon.current], {
        opacity: 0,
        display: "none",
        scale: 0,
        ease: "back.out(3)",
        // rotate: 120,
        duration: 0.5,
        stagger: 0.3,
      })
      timeline.from(topRightIcon.current, {
        rotate: 360,
        duration: 0.8,
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
        <div ref={topRightIcon} className="absolute inset-x-0 top-0">
          <div className="flex relative w-12 h-12 sm:w-20 sm:h-20">
            <StarIcon className="absolute right-1 w-3 h-3 text-purple-400 sm:right-2 sm:w-6 sm:h-6" />
            <StarIcon className="absolute left-1 w-3 h-3 text-purple-400 sm:left-2 sm:w-6 sm:h-6" />
            <StarIcon className="absolute -right-1 bottom-3 w-3 h-3 text-purple-400 sm:right-0 sm:bottom-4 sm:w-6 sm:h-6" />
            <StarIcon className="absolute bottom-3 -left-1 w-3 h-3 text-purple-400 sm:bottom-4 sm:left-0 sm:w-6 sm:h-6" />
            <StarIcon className="absolute right-[17.5px] -bottom-1 w-3 h-3 text-purple-400 sm:right-7 sm:-bottom-1 sm:w-6 sm:h-6" />
          </div>
        </div>
        <StarIcon className="w-12 h-12 text-yellow-400 sm:w-20 sm:h-20" />
      </div>
    )
  }

  return <StarIcon className="w-12 h-12 text-gray-500 sm:w-20 sm:h-20" />
}

export const Star = memo(StarComp)
