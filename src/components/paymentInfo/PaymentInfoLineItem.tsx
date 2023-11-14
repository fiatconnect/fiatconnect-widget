import React, { useState } from 'react'
interface Props {
  title: string
  placeholder: string
  onChange: (value: string) => void
  value: string
  allowedValues?: [string, ...string[]]
}

export function PaymentInfoLineItem({
  title,
  placeholder,
  onChange,
  value,
  allowedValues,
}: Props) {
  // TODO: Implement allowedValues

  const onChangeWrapper = (e: any) => {
    const newValue = e.target.value
    onChange(newValue)
  }

  return (
    <div>
      <form>
        <label id="PaymentInfoLineItem">
          {title}
          <input
            id="PaymentInfoLineItem-Input"
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChangeWrapper}
          />
        </label>
      </form>
    </div>
  )
}
