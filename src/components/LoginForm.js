import React, { useState } from 'react'
import loginService from '../services/login'

const LoginForm = ({ updateUser, setErrorMessage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      updateUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage(
        'Wrong credentials'
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      console.log('Wrong credentials')
    }
  }

  return (
    <div className='text-center'>
      <h1 className='mt-5 mb-3'>Please sign in</h1>
      <form style={{maxWidth : '480px', margin : 'auto'}} onSubmit={handleLogin}>
        <input
          type="text"
          className="form-control mb-2"
          placeholder='Username'
          value={username}
          name="Username"
          required autoFocus
          onChange={({ target }) => setUsername(target.value)}
        />
        <input
          type="password"
          className="form-control"
          placeholder='Password'
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
        <div className='mt-3'>
          <button className='btn btn-lg btn-block btn-primary' type="submit">Sign In</button>
        </div>

      </form>
    </div>
  )
}

export default LoginForm