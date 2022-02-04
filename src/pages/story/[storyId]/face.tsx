/* eslint-disable @next/next/no-img-element */
import { gsap } from "gsap"
import type { VFC } from "react"
import { useEffect, useRef, useState } from "react"

type Props = {
  star: 1 | 2 | 3 | 4 | 5
}

const review = {
  1: "BAD",
  2: "SOSO",
  3: "GOOD",
  4: "EXCELLENT",
  5: "WOW",
}

export const Face: VFC<Props> = ({ star }) => {
  const faceRef = useRef<HTMLDivElement>(null)
  const [modalTween] = useState(gsap.timeline({ paused: true }))

  useEffect(() => {
    if (faceRef.current) {
      modalTween.from(faceRef.current, {
        opacity: 0,
        display: "none",
        ease: "power4.inOut",
        duration: 0.5,
      })
    }
  }, [modalTween])

  // starの値が変わるとmodalTween.play()

  useEffect(() => {
    if (star) {
      modalTween.play()
    }
  }, [star, modalTween])

  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="mb-4 text-4xl font-black text-yellow-400">
        {review[star]}
      </h3>
      <div className="flex flex-col items-center w-full" ref={faceRef}>
        <img className="w-1/2 h-1/2" src={`/img/${star}.svg`} alt={`${star}`} />
      </div>
    </div>
  )
}
