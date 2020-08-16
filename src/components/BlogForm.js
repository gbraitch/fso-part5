import React, { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const BlogForm = ({ updateBlogs, setErrorMessage }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogURL, setBlogURL] = useState('')

  const createBlog = async (event) => {
    event.preventDefault()
    try {
      const blogObject = {
        title: blogTitle,
        author: blogAuthor,
        url: blogURL
      }

      const returnedBlog = await blogService.create(blogObject)
      updateBlogs(returnedBlog)
      setBlogTitle('')
      setBlogAuthor('')
      setBlogURL('')
    } catch (exception) {
      setErrorMessage(
        'Failed to add new blog'
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      console.log('Failed to create blog')
    }
  }


  return (
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
}

BlogForm.propTypes = {
  updateBlogs: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
}


export default BlogForm