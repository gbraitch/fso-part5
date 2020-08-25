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
    <div className='mx-3'>
      <h3>Add New Blog</h3>
      <form onSubmit={createBlog}>
        <div>
          Title:
          <input
            className='form-control'
            type="text"
            value={blogTitle}
            name="Title"
            onChange={({ target }) => setBlogTitle(target.value)}
          />
        </div>
        <div>
          Author:
          <input
            className='form-control'
            type="text"
            value={blogAuthor}
            name="Author"
            onChange={({ target }) => setBlogAuthor(target.value)}
          />
        </div>
        <div>
          URL:
          <input
            className='form-control'
            type="text"
            value={blogURL}
            name="URL"
            onChange={({ target }) => setBlogURL(target.value)}
          />
        </div>
        <button className='btn btn-primary' type="submit">add</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  updateBlogs: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
}


export default BlogForm