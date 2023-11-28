import React, { useState } from 'react'
import styled from 'styled-components'

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
    <Container>
      <Form>
        <Fieldset>
          <legend>{title}</legend>
          <Input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChangeWrapper}
          />
        </Fieldset>
      </Form>
    </Container>
  )
}

const Fieldset = styled.fieldset`
  border-radius: 5px;
  border-width: 1px;
  text-align: start;
`

const Form = styled.form`
  width: 100%;
`

const Input = styled.input`
  border: none;
  outline: none;
  text-align-vertical: bottom;
  width: 100%;
`

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  font-size: 13px;
  width: 100%;
`
