import {
  CheckCircleIcon,
  ExclamationIcon,
  InformationCircleIcon,
  XCircleIcon,
  XIcon,
} from "@heroicons/react/solid"
import type { VFC } from "react"
import { memo } from "react"
import type { Toast } from "react-hot-toast"
import toast from "react-hot-toast"

type AlertProps = {
  usage: "success" | "info" | "warning" | "error"
  title: string
  message?: string
  t?: Toast
}

const AlertComp: VFC<AlertProps> = ({ message, t, title, usage }) => {
  return (
    <div className="flex relative flex-col p-4 w-[300px] text-purple-500 bg-white rounded-xl border-2 border-purple-500 md:w-[500px]">
      {t && (
        <button
          className="absolute top-3 right-3 rounded-full focus:ring-2 ring-purple-200 duration-200"
          onClick={() => {
            toast.dismiss(t.id)
          }}
        >
          <XIcon className="w-5 h-5" />
        </button>
      )}

      <div className="flex items-center">
        <div className="mr-2 w-10">
          {usage === "error" && (
            <XCircleIcon className="w-10 h-10 text-red-500" />
          )}
          {usage === "warning" && (
            <ExclamationIcon className="w-10 h-10 text-orange-500" />
          )}
          {usage === "info" && (
            <InformationCircleIcon className="w-10 h-10 text-blue-500" />
          )}
          {usage === "success" && (
            <CheckCircleIcon className="w-10 h-10 text-purple-500" />
          )}
        </div>
        <div className="flex flex-col">
          <p className="mb-4 text-lg font-bold">{title}</p>
          <p>{message}</p>
        </div>
      </div>
    </div>
  )
}

export const Alert = memo(AlertComp)
