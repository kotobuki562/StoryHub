import type {
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
} from "react"
import { forwardRef, memo } from "react"

export type InputProps = {
  label: string
  name: string
  type: string
  onChange: ChangeEventHandler<HTMLInputElement>
  value?: string | number | readonly string[]
  ref?: React.Ref<any>
  placeholder?: string
  disabled?: boolean
  required?: boolean
  onBlur?: ChangeEventHandler<HTMLInputElement>
  onKeyPress?: KeyboardEventHandler<HTMLInputElement>
  onFocus?: FocusEventHandler<HTMLInputElement>
  error?: {
    isError: boolean
    message: string
  }
}

// InputのkeyPressイベントでhandleSubmitが呼ばれないようにする
const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") {
    e.preventDefault()
  }
}

const InputComp: React.ForwardRefExoticComponent<InputProps> = forwardRef(
  (props, ref) => {
    return (
      <>
        <label className="flex items-center mb-1 text-sm font-bold text-left text-slate-500">
          <p>{props.label}</p>
          {props.required && <span className="ml-2 text-red-500">*</span>}
        </label>
        <input
          className="p-2 w-full rounded-lg border-2 border-purple-500 focus:outline-none focus:ring-2 ring-purple-300"
          id={props.name}
          onFocus={props.onFocus}
          name={props.name}
          type={props.type}
          value={props.value}
          ref={ref}
          onChange={props.onChange}
          onBlur={props.onBlur}
          disabled={props.disabled}
          required={props.required}
          onKeyPress={props.onKeyPress || handleKeyPress}
          placeholder={props.placeholder}
        />
        {props.error && props.error.isError && (
          <p className="text-xs italic text-red-500">{props.error.message}</p>
        )}
      </>
    )
  }
)

const Input = memo(InputComp)

export { Input }
