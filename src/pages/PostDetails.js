import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import axios from 'axios'

const PostDetails = ({ BASE_URL }) => {
  let { id } = useParams()
  const [postDetails, setPostDetails] = useState([])
  let [newComment, setNewComment] = useState({
    post: id,
    body: ''
  })
  let navigate = useNavigate()

  const handleChange = (e) => {
    setNewComment({ ...newComment, [e.target.name]: e.target.value })
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    await axios.delete(`${BASE_URL}/posts/${id}`)
    navigate('/ForumList')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios.post(`${BASE_URL}/comments/`, newComment)
    setNewComment({
      post: id,
      body: ''
    })
  }

  useEffect(() => {
    const getPostDetails = async () => {
      let res = await axios.get(`${BASE_URL}/posts/${id}`)
      setPostDetails(res.data)
    }
    getPostDetails()
  }, [newComment])

  return (
    <div>
      <div className="banner post-image-container">
        {postDetails.photo_urls?.map((photo) => (
          <img src={photo} className="post-detail-images" alt="post-image" />
        ))}
      </div>
      <div className="card-body">
        <h3 className="card-caption">Caption: </h3>
        <br />
        <p className="card-caption">{postDetails.caption}</p>
        <br />
        {postDetails.hashtags?.map((hashtag) => (
          <h4 className="hashtag">{hashtag}</h4>
        ))}
      </div>
      <button className="delete-post-button" onClick={handleDelete}>
        Delete Post
      </button>
      <br />
      <h3 className="comment-label">Comments: </h3>
      <div className="comment-container">
        {postDetails.comments?.map((comment) => (
          <p className="comment">{comment.body}</p>
        ))}
        <div className="comment-form">
          <form>
            <textarea
              className="comment-box"
              rows="10"
              placeholder="Leave a comment!"
              name="body"
              value={newComment.body}
              onChange={handleChange}
            ></textarea>
            <br />
            <button onClick={handleSubmit} className="post-button">
              Post Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PostDetails
