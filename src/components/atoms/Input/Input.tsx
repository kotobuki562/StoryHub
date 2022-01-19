import cc from "classcat"
import type {
  ChangeEventHandler,
  FocusEventHandler,
  ForwardRefExoticComponent,
  KeyboardEventHandler,
} from "react"
import { forwardRef, memo } from "react"

// InputのkeyPressイベントでhandleSubmitが呼ばれないようにする
const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") {
    e.preventDefault()
  }
}

type InputProps = {
  label: string
  type:
    | "text"
    | "password"
    | "email"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "date"
    | "time"
    | "datetime-local"
  labelName: string
  placeholder?: string
  disabled?: boolean
  max?: string | number
  min?: string | number
  value?: string | number | readonly string[]
  onBlur?: ChangeEventHandler<HTMLInputElement>
  onKeyPress?: KeyboardEventHandler<HTMLInputElement>
  onFocus?: FocusEventHandler<HTMLInputElement>
  onChange?: ChangeEventHandler<HTMLInputElement>
}

const InputComp: ForwardRefExoticComponent<InputProps> = forwardRef(
  (
    {
      disabled,
      label,
      labelName,
      max,
      min,
      onBlur,
      onChange,
      onFocus,
      onKeyPress,
      placeholder,
      type,
      value,
    },
    ref
  ) => (
    <div className="flex flex-col w-full">
      <label
        htmlFor={labelName}
        className="flex justify-between items-center mb-1 text-sm font-bold text-left text-slate-500"
      >
        <p>{label}</p>
        {max && typeof value === "string" && (
          <p className={cc([value && value.length >= max && "text-red-500"])}>
            {value?.length}/{max}
          </p>
        )}
      </label>
      <input
        onBlur={onBlur}
        onKeyPress={onKeyPress || handleKeyPress}
        onFocus={onFocus}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ref={ref}
        value={value}
        type={type}
        max={max}
        min={min}
        className="p-2 w-full rounded-lg border-2 border-purple-500 focus:outline-none focus:ring-2 ring-purple-300"
      />
    </div>
  )
)

export const Input = memo(InputComp)
