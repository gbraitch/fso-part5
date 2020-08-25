import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Collapse from 'react-bootstrap/Collapse'
import Button from 'react-bootstrap/Button'

const Togglable = props => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button className='btn btn-outline-primary' onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        <Collapse in={visible}>
          <div>
            {props.children}
            <Button className='btn btn-danger ml-3' onClick={toggleVisibility}>cancel</Button>
          </div>
        </Collapse>

      </div>
    </div>
  )
}

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

Togglable.displayName = 'Togglable'

export default Togglable