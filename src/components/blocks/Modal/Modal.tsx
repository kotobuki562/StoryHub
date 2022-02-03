/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { gsap } from "gsap"
import type { ReactNode } from "react"
import type { VFC } from "react"
import { memo, useCallback, useEffect, useRef, useState } from "react"

type Props = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  header?: ReactNode
  footer?: ReactNode
}

const ModalComp: VFC<Props> = ({
  children,
  footer,
  header,
  isOpen,
  onClose,
}) => {
  const modalVeil = useRef<HTMLDivElement>(null)
  const modalDialog = useRef<HTMLDivElement>(null)
  const modalContent = useRef<HTMLDivElement>(null)
  const [modalTween] = useState(gsap.timeline({ paused: true }))

  useEffect(() => {
    if (modalVeil.current) {
      modalTween.from(modalVeil.current, {
        opacity: 0,
        display: "none",
        ease: "power4.inOut",
        duration: 0.5,
      })
    }
  }, [modalTween])

  useEffect(() => {
    if (modalDialog.current) {
      modalTween.from(modalDialog.current, {
        scale: 0,
        opacity: 0,
        display: "none",
        ease: "power4.inOut",
        duration: 0.5,
      })
    }
  }, [modalTween])

  useEffect(() => {
    if (modalContent.current) {
      modalTween.from(modalContent.current.childNodes, {
        y: 100,
        opacity: 0,
        display: "none",
        ease: "power4.inOut",
        // ease: "back.out(3.05)",
        duration: 0.5,
      })
    }
  }, [modalTween])

  useEffect(() => {
    if (isOpen) {
      modalTween.play()
    } else {
      modalTween.reverse()
    }
  }, [modalTween, isOpen])

  // useEffect(() => {
  //   modalTween.reversed(!isOpen);
  // }, [modalTween, isOpen]);

  const handleClose = useCallback(() => {
    modalTween.reverse()
    gsap.delayedCall(modalTween.duration(), onClose)
  }, [modalTween, onClose])

  return (
    <div className={`${isOpen ? "block" : "hidden"} fixed inset-0 z-50`}>
      <div
        ref={modalVeil}
        onClick={handleClose}
        className="absolute inset-0 bg-gray-900 opacity-75"
      />
      <div className="flex overflow-scroll overscroll-none flex-col justify-center items-center w-screen h-full no-scrollbar">
        <div
          ref={modalDialog}
          className="overflow-scroll overscroll-none inset-0 z-50 w-[330px] h-full max-h-[800px] bg-white rounded-xl xs:w-[400px] sm:w-[500px] lg:w-[700px] no-scrollbar"
        >
          <div
            ref={modalContent}
            className="flex relative flex-col justify-center items-center"
          >
            {header && (
              <div className="sticky top-0 z-10 w-full bg-purple-100">
                {header}
              </div>
            )}
            {children}
            {footer && (
              <div className="sticky bottom-0 z-10 w-full bg-purple-100">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const Modal = memo(ModalComp)
