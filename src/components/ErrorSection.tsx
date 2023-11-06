import React  from 'react'
import ErrorIcon from '../icons/Error'

interface Props {
  title: string
  message: string
}

export function ErrorSection({ title, message }: Props) {
  return (
    <div className='ErrorSection'>
      <div id='errorTitle'>
	{title}
      </div>
      <div id='errorIcon'>
	<ErrorIcon/>
      </div>
      <div id='errorText'>
	{message}
      </div>
      <div id='errorText'>
      	You can try again, or if the error persists, contact your wallet provider for more help.
      </div>
    </div>
  )
}

