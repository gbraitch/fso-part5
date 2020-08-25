import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import Toggleable from './components/Toggleable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [dropDownValue, setdropDownValue] = useState('Sort By')
  const [sort, setSort] = useState(null)

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

    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]')
    const currentTheme = localStorage.getItem('theme')

    if (currentTheme) {
      document.documentElement.setAttribute('data-theme', currentTheme)
      if (currentTheme === 'dark') {
        toggleSwitch.checked = true
      }
    }
  }, [])

  const updateUser = async (user) => {
    blogService.setToken(user.token)
    setUser(user)
  }

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedNoteappUser')
  }

  const updateBlogs = (returnedBlog) => {
    setBlogs(blogs.concat(returnedBlog))
    setSuccessMessage(
      `A new blog: ${returnedBlog.title} has been added`
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

  const setSortLikes = (e) => {
    setdropDownValue(e)
    setSort('likes')
  }

  const sortByLikes = ((a, b) => (a.likes < b.likes ? 1 : -1 ))

  const setSortTitle = (e) => {
    setdropDownValue(e)
    setSort('title')
  }

  const sortByTitle = ((a, b) =>  a.title.localeCompare(b.title))

  const setSortAuthor = (e) => {
    setdropDownValue(e)
    setSort('author')
  }

  const sortByAuthor= ((a, b) => a.author.localeCompare(b.author))

  const loginForm = () => (
    <LoginForm updateUser={updateUser} setErrorMessage={setErrorMessage}/>
  )

  const displayBlogs = () => {
    if (sort === null) {
      return (
        blogs.map((blog, index) =>
          <Blog
            num={index+1}
            key={blog.id}
            blog={blog}
            addLike={() => updateBlogLikes(blog)}
            removeBlog={() => removeBlog(blog)}
            user={user}
          />
        )
      )
    } else {
      let sortMethod
      switch(sort) {
      case 'likes':
        sortMethod = (a,b) => sortByLikes(a,b)
        break

      case 'title':
        sortMethod = (a,b) => sortByTitle(a,b)
        break

      case 'author':
        sortMethod = (a,b) => sortByAuthor(a,b)
        break

      default:
        break
      }

      return (
        blogs
          .sort(sortMethod)
          .map((blog, index) =>
            <Blog
              num={index+1}
              key={blog.id}
              blog={blog}
              addLike={() => updateBlogLikes(blog)}
              removeBlog={() => removeBlog(blog)}
              user={user}
            />
          )
      )
    }
  }

  const switchTheme = (e) => {
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
    else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }

  return (
    <div className='container'>
      <Notification message={errorMessage} error={true}/>
      <Notification message={successMessage} error={false}/>

      <div className="theme-switch-wrapper float-right">
        <label className="theme-switch">
          <input type="checkbox" id="checkbox" onClick={(e) => switchTheme(e)} />
          <div className="slider round"></div>
        </label>
        <em></em>
      </div>


      {user === null ?
        loginForm() :
        <div>
          <div className='mt-5'>
            <h1 className='text-center'>blogs</h1>
            <button className='btn btn-outline-danger float-right' onClick={() => handleLogout()}>logout</button>
          </div>

          <h2> Welcome {user.name} </h2>
          <div className='mt-5'>
            <Toggleable buttonLabel='Add New Blog'>
              <BlogForm updateBlogs={updateBlogs} setErrorMessage={setErrorMessage}/>
            </Toggleable>
          </div>
          <div className='mt-5'>
            <div>
              <h2>
                bloglist
                <DropdownButton title={dropDownValue} className="format float-right">
                  <Dropdown.Item as="button"><div onClick={(e) => setSortLikes(e.target.textContent)}>Likes</div></Dropdown.Item>
                  <Dropdown.Item as="button"><div onClick={(e) => setSortTitle(e.target.textContent)}>Title</div></Dropdown.Item>
                  <Dropdown.Item as="button"><div onClick={(e) => setSortAuthor(e.target.textContent)}>Author</div></Dropdown.Item>
                </DropdownButton>
              </h2>
            </div>

            <div className='mt-4'>
              {displayBlogs()}
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default App