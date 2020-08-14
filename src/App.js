import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogURL, setBlogURL] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage(
        `Wrong credentials`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      console.log('Wrong credentials')
    }
  }

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
  }

  const createBlog = async (event) => {
    event.preventDefault()
    try {
    const blogObject = {
      title: blogTitle,
      author: blogAuthor,
      url: blogURL
    }

    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setBlogTitle('')
    setBlogAuthor('')
    setBlogURL('')

    setSuccessMessage(
      `a new blog ${returnedBlog.title} added`
    )
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  } catch (exception) {
    setErrorMessage(
      `Failed to add new blog`
    )
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
    console.log('Failed to create blog')
  }
  }

  const addBlogForm = () => (
    <div>
      <h2>Create New</h2>
      <form onSubmit={createBlog}>
        <div>
          title:
            <input
            type="text"
            value={blogTitle}
            name="Title"
            onChange={({ target }) => setBlogTitle(target.value)}
            />
        </div>
        <div>
          author:
            <input
            type="text"
            value={blogAuthor}
            name="Author"
            onChange={({ target }) => setBlogAuthor(target.value)}
            />
        </div>
        <div>
          url:
            <input
            type="text"
            value={blogURL}
            name="URL"
            onChange={({ target }) => setBlogURL(target.value)}
            />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )


  const renderPage = () => {
    if (user === null) {
      return (
        <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
              <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
              <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
        </div>
      )
    }

    return (
      <div>
      <p>{user.name} logged-in</p>
      <button onClick={() => handleLogout()}>logout</button>
      {addBlogForm()}
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      </div>
    )
  }

  return (
    <div>
      <Notification message={errorMessage} error={true}/>
      <Notification message={successMessage} error={false}/>
      {renderPage()}
    </div>
  )
}

export default App