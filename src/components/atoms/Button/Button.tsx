/* eslint-disable @next/next/no-img-element */
import cc from "classcat"
import type { ReactNode, VFC } from "react"
import { memo } from "react"

type ButtonProps = {
  type?: "button" | "submit" | "reset"
  icon?: ReactNode
  usage: "base" | "reject"
  isLoading?: boolean
  text: string
  disabled?: boolean
  onClick?: () => void
  primary?: boolean
}

const ButtonComp: VFC<ButtonProps> = ({
  disabled,
  icon,
  isLoading,
  onClick,
  primary,
  text,
  type,
  usage,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type || "button"}
      className={cc([
        "flex flex-col items-center p-2 w-full font-semibold rounded-lg border focus:outline-none focus:ring-2 ring-purple-300",
        !disabled && usage === "base" && primary && "text-white bg-purple-500",
        !disabled && usage === "reject" && primary && "text-white bg-red-500",
        !disabled &&
          usage === "base" &&
          !primary &&
          "text-purple-500 border-2 border-purple-500",
        !disabled &&
          usage === "reject" &&
          !primary &&
          "text-red-500 border-2 border-red-500",
        disabled && "bg-purple-100 text-purple-300 cursor-not-allowed",
        isLoading && "cursor-move ",
      ])}
    >
      <div className="flex items-center w-full">
        {isLoading ? (
          <div className="w-8 h-8 animate-spin">
            <img src="/img/Loading.svg" alt="loading" />
          </div>
        ) : (
          <>
            {icon}
            <p>{text}</p>
          </>
        )}
      </div>
    </button>
  )
}

export const Button = memo(ButtonComp)
