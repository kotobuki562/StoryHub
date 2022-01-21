import cc from "classcat"
import type { VFC } from "react"
import { memo } from "react"

export type Props = {
  checked: boolean
  onToggle: () => void

  size: "small" | "medium" | "large"
}

const SwitchComp: VFC<Props> = ({ checked, onToggle, size }) => (
  <button
    type="button"
    onClick={onToggle}
    className={cc([
      "flex items-center px-1 rounded-full cursor-pointer",
      !checked ? "bg-gray-300" : "bg-purple-500",
      size === "small" && "w-12 h-6",
      size === "medium" && "w-16 h-8",
      size === "large" && "w-20 h-10",
    ])}
  >
    <div
      className={cc([
        "bg-white rounded-full transition-transform transform",
        size === "small" && "w-4 h-4",
        size === "medium" && "w-6 h-6",
        size === "large" && "w-8 h-8",
        checked && size === "small"
          ? // translate-x-6が効かなかったのでcssで対応
            "switch-sm"
          : "translate-x-0",
        checked && size === "medium" ? "translate-x-8" : "translate-x-0",
        checked && size === "large" ? "translate-x-10" : "translate-x-0",
      ])}
    />
  </button>
)

export const Switch = memo(SwitchComp)
