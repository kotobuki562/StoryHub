/* eslint-disable @next/next/no-img-element */
import cc from "classcat"
import type { VFC } from "react"
import { memo } from "react"

type ButtonProps = {
  type?: "button" | "submit" | "reset"
  usage: "base" | "reject"
  isLoading?: boolean
  text: string
  disabled?: boolean
  onClick?: () => void
}

const ButtonComp: VFC<ButtonProps> = ({
  disabled,
  isLoading,
  onClick,
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
        !disabled && usage === "base" && "text-white bg-purple-500",
        !disabled && usage === "reject" && "text-white bg-red-500",
        disabled && "bg-purple-100 text-purple-300 cursor-not-allowed",
        isLoading && "cursor-move ",
      ])}
    >
      {isLoading ? (
        <div className="w-8 h-8 animate-spin">
          <img src="/img/Loading.svg" alt="loading" />
        </div>
      ) : (
        <p>{text}</p>
      )}
    </button>
  )
}

export const Button = memo(ButtonComp)
