import { useRef } from "react"

interface InputProps {
  editing: boolean
  defaultValue: string
  prefix?: string
  inputPrefix?: string
  // onChange: (value: string) => void
  name: string
  maxLength?: number
  readOnly?: boolean
}


export default function InfoContainer({ editing, defaultValue, name, prefix, maxLength, inputPrefix, readOnly = false }: InputProps) {
  const inputPrefixRef = useRef<HTMLSpanElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleInput(e: any) {
    let element: HTMLInputElement = e.target
    let length = element.value.length
    let min = 1
    let max = 36

    if (inputPrefix) {
      inputPrefixRef.current!.innerText = "".padStart(4 - element.value.length, inputPrefix)
    }

    function sort(a: number, b: number) {
      return a - b
    }

    let width = [length, min, max].sort(sort)[1]

    element.style.width = width + 'ch'
  }

  function padInput(e: any) {
    if (!inputPrefix) return

    inputPrefixRef.current!.innerText = ""
    inputRef.current!.value = inputRef.current!.value.padStart(4, '0')
    handleInput(e)
  }

  return (
    <div
      className={`flex transition-all duration-100 rounded-md px-3 py-0.5 ${editing && !readOnly ? "" : 'bg-gray-100 text-gray-600'}`}>
      <span>{prefix}</span>
      <span className="text-gray-400" ref={inputPrefixRef}></span>
      <input
        maxLength={maxLength}
        onChange={handleInput}
        onBlur={padInput}
        className="outline-none bg-transparent"
        type={name == 'email' ? 'email' : 'text'}
        ref={inputRef}
        name={name}
        readOnly={!editing || readOnly}
        defaultValue={defaultValue}
        style={{ width: defaultValue.length + 'ch' }}
      />
    </div>
  )
}