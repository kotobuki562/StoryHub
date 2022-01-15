/* eslint-disable react/destructuring-assignment */
import cc from "classcat"
import type { VFC } from "react"
import type { ReactNode } from "react"
import { memo, useEffect, useRef } from "react"

type Props = {
  isOpen: boolean
  onToggle: () => void
  toggleButton: ReactNode
  children: ReactNode
}

const AccodionComp: VFC<Props> = props => {
  const linksContainerRef = useRef<any>(null)
  const linksRef = useRef<any>(null)

  useEffect(() => {
    const linksHeight = linksRef.current.getBoundingClientRect().height
    if (props.isOpen) {
      linksContainerRef.current.style.height = `${linksHeight}px`
    } else {
      linksContainerRef.current.style.height = `0px`
    }
  }, [props.isOpen])

  return (
    <nav className="flex flex-col items-center w-full">
      <div className="w-full">
        <button className="w-full" onClick={props.onToggle}>
          {props.toggleButton}
        </button>
      </div>
      <div
        className="overflow-hidden w-full duration-200"
        ref={linksContainerRef}
      >
        <ul className={cc(["w-full"])} ref={linksRef}>
          {props.children}
        </ul>
      </div>
    </nav>
  )
}

export const Accordion = memo(AccodionComp)
