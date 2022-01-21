import cc from "classcat"
import type {
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
} from "react"
import { forwardRef, memo } from "react"

export type InputProps = {
  label: string
  name: string
  height?: number
  onChange: ChangeEventHandler<HTMLTextAreaElement>
  value?: string | number | readonly string[]
  ref?: React.Ref<any>
  placeholder?: string
  disabled?: boolean
  required?: boolean
  onBlur?: ChangeEventHandler<HTMLTextAreaElement>
  onKeyPress?: KeyboardEventHandler<HTMLTextAreaElement>
  onFocus?: FocusEventHandler<HTMLTextAreaElement>
}

// InputのkeyPressイベントでhandleSubmitが呼ばれないようにする
const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === "Enter") {
    e.preventDefault()
  }
}

const TextAreaComp: React.ForwardRefExoticComponent<InputProps> = forwardRef(
  (props, ref) => (
    <>
      <label className="flex items-center mb-1 text-sm font-bold text-left text-slate-500">
        <p>{props.label}</p>
        {props.required && <span className="ml-2 text-red-500">*</span>}
      </label>
      <textarea
        className={cc([
          "p-2 w-full rounded-lg border-2 border-purple-500 focus:outline-none focus:ring-2 ring-purple-300 resize-none",
          props.height ? `h-[${props.height}px]` : "h-[300px]",
        ])}
        id={props.name}
        onFocus={props.onFocus}
        name={props.name}
        value={props.value}
        ref={ref}
        onChange={props.onChange}
        onBlur={props.onBlur}
        disabled={props.disabled}
        required={props.required}
        onKeyPress={props.onKeyPress || handleKeyPress}
        placeholder={props.placeholder}
      />
    </>
  )
)

const TextArea = memo(TextAreaComp)

export { TextArea }
