import type {
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
} from "react"
import { forwardRef, memo } from "react"

export type InputProps = {
  label: string
  name?: string
  options: Array<{
    value: string | number | readonly string[] | undefined
    label: string | number
  }>
  onChange: ChangeEventHandler<HTMLSelectElement>
  value?: string | number | readonly string[]
  ref?: React.Ref<any>
  placeholder?: string
  disabled?: boolean
  required?: boolean
  onBlur?: ChangeEventHandler<HTMLSelectElement>
  onKeyPress?: KeyboardEventHandler<HTMLSelectElement>
  onFocus?: FocusEventHandler<HTMLSelectElement>
}

// InputのkeyPressイベントでhandleSubmitが呼ばれないようにする
const handleKeyPress = (e: React.KeyboardEvent<HTMLSelectElement>) => {
  if (e.key === "Enter") {
    e.preventDefault()
  }
}

const SelectComp: React.ForwardRefExoticComponent<InputProps> = forwardRef(
  (props, ref) => {
    return (
      <>
        <label className="flex items-center mb-1 text-sm font-bold text-left text-slate-500">
          <p>{props.label}</p>
          {props.required && <span className="ml-2 text-red-500">*</span>}
        </label>
        <select
          className="p-2 w-full rounded-lg border-2 border-purple-500 focus:outline-none focus:ring-2 ring-purple-300"
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
        >
          {props.options.map(option => {
            return (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            )
          })}
        </select>
      </>
    )
  }
)

const Select = memo(SelectComp)

export { Select }
