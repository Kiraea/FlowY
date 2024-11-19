import React from 'react'
import {useState} from 'react'
type errorLabelProps = {
    errorLabel: string
}
function ErrorLabel({errorLabel} : errorLabelProps) {
  return (
    <div className='bg-white'>{errorLabel ? errorLabel : null}</div>
  )
}

export default ErrorLabel