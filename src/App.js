import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import Toggleable from './components/Toggleable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
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

  const updateUser = async (user) => {
    blogService.setToken(user.token)
    setUser(user)
  }

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
  }

  const updateBlogs = (returnedBlog) => {
    setBlogs(blogs.concat(returnedBlog))
    setSuccessMessage(
      `a new blog ${returnedBlog.title} added`
    )
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  const updateBlogLikes = (blog) => {
    const updatedblog = { ...blog, likes: blog.likes+1 }

    blogService
      .update(blog.id, updatedblog)
      .then(returnedBlog => {
        setBlogs(blogs.map(b => b.id !== returnedBlog.id ? b : returnedBlog))
      })
  }

  const removeBlog = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      blogService
        .remove(blog.id)
        .then(() => {
          setBlogs(blogs.filter(b => b.id !== blog.id))
        })
    }
  }

  const loginForm = () => (
    <Toggleable buttonLabel='log in'>
      <LoginForm updateUser={updateUser} setErrorMessage={setErrorMessage}/>
    </Toggleable>
  )

  return (
    <div>
      <Notification message={errorMessage} error={true}/>
      <Notification message={successMessage} error={false}/>

      {user === null ?
        loginForm() :
        <div>
          <h2>blogs</h2>
          <p>
            {user.name} logged-in
            <button onClick={() => handleLogout()}>logout</button>
          </p>
          <Toggleable buttonLabel='new blog'>
            <BlogForm updateBlogs={updateBlogs} setErrorMessage={setErrorMessage}/>
          </Toggleable>
          <h2>blogs</h2>
          {blogs
            .sort((a, b) => {
              if (a.likes >= b.likes) return -1
              else return 1
            })
            .map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
                addLike={() => updateBlogLikes(blog)}
                removeBlog={() => removeBlog(blog)}
                user={user}
              />
            )}
        </div>
      }
    </div>
  )
}

export default App