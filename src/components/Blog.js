import React from 'react'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button'

const Blog = ({ num, blog, addLike, removeBlog, user }) => {

  const removeButton = () => {
    if (blog.user.username === user.username) {
      return (
        <div>
          <button className='btn btn-danger btn-sm py-0 mt-3' onClick={removeBlog}>remove</button>
        </div>
      )
    }
    else {
      console.log('not same user')
      return (
        <div>
          <button
            className='btn btn-danger btn-sm py-0 mt-3'
            data-toggle="tooltip"
            data-placement="right"
            title="User did not create this note"
            aria-disabled='true'
            disabled>
            remove
          </button>
        </div>
      )
    }
  }

  return (
    <Accordion className='mb-1'>
      <Card>
        <Card.Header>
          <div className="row">
            <div className="col-md-11">
              <Accordion.Toggle as={Button} variant="link" eventKey={num}>
                {blog.title} by {blog.author}
              </Accordion.Toggle>
            </div>
            <div className="col-md-1 float-right">
              {removeButton()}
            </div>
          </div>
        </Card.Header>
        <Accordion.Collapse eventKey={num}>
          <Card.Body>
            <div><strong>Title: </strong> {blog.title}</div>
            <div><strong>Author: </strong> {blog.author}</div>
            <div> <strong>URL: </strong> {blog.url}</div>
            <div>
              <strong>Likes: </strong>{blog.likes} <br/>
              <button className='btn btn-sm py-0 btn-primary' onClick={addLike}>Like!</button>
            </div>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  )
}

export default Blog
