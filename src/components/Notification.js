import React from 'react'
import Alert from 'react-bootstrap/Alert'

const Notification = ({ message, error }) => {
  if (message === null) {
    return null
  }

  return (
    <Alert  variant={`${error ? 'danger' : 'success'} alert ml-3`}>
      {message}
    </Alert>
  )
}

export default Notification