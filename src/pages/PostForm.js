import { useNavigate, useParams } from 'react-router'
import { useState } from 'react'
import axios from 'axios'

const PostForm = ({ BASE_URL }) => {
  let { id } = useParams()
  const [hashtagInput, setHashtagInput] = useState('')
  const [hashtagError, setHashtagError] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [fileLimit, setFileLimit] = useState('')
  const [formValues, setFormValues] = useState({
    forum: id,
    photo_urls: [],
    caption: '',
    hashtags: []
  })
  let navigate = useNavigate()

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleHashtagInput = (e) => {
    setHashtagInput(e.target.value)
  }

  const addHashtag = (e) => {
    e.preventDefault()
    if (hashtagInput.includes(' ')) {
      setHashtagInput('')
      setHashtagError(`Hashtags must begin with '#' and not contain any spaces`)
    } else {
      setFormValues({
        ...formValues,
        hashtags: [...formValues.hashtags, hashtagInput]
      })
      setHashtagInput('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios.post(`${BASE_URL}/posts/`, formValues)
    setFormValues({
      forum: id,
      photo_urls: [],
      caption: '',
      hashtags: []
    })
    navigate(`/ForumDetails/${id}`)
  }

  const onFileChange = (e) => {
    const clientId = process.env.REACT_APP_CLIENT_ID
    const auth = 'Client-ID ' + clientId

    if (e.target.files.length > 10) {
      setFileLimit(e.target.files.length)
      document.getElementById('upload-post').disabled = true
    } else {
      Object.values(e.target.files).forEach((file) => {
        const formData = new FormData()
        formData.append('image', file)

        fetch('https://api.imgur.com/3/image', {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: auth
          },
          body: formData
        })
          .then((data) => data.json())
          .then((data) => {
            console.log(data)
            if (data.success === true) {
              formValues.photo_urls.push(data.data.link)
            } else if (data.success === false) {
              setUploadError('error')
            }
          })
      })
    }
  }

  return (
    <div className="forum-form">
      <form className="forum-form-fields">
        <label>Post Your Photo(s): </label>
        <input
          className="upload-photo"
          name="photo_urls"
          type="file"
          multiple="multiple"
          onChange={onFileChange}
        />
        <br />
        {fileLimit ? (
          <div className="limit-error">
            Too many files uploaded, you may only upload up to 10 pictures per
            post.
          </div>
        ) : null}
        {uploadError ? (
          <div className="error">Image failed to upload</div>
        ) : null}
        <br />
        <textarea
          name="caption"
          rows="10"
          placeholder="Write a Caption"
          onChange={handleChange}
        />
        <br />
        {hashtagError ? <div>{hashtagError}</div> : null}
        <label>Hashtags: </label>
        <div>
          <input
            id="hashtagInput"
            className="hashtag-input"
            name="hashtagInput"
            value={hashtagInput}
            type="text"
            placeholder="#hashtag"
            onChange={handleHashtagInput}
          />
          <button type="submit" className="hashtag-button" onClick={addHashtag}>
            +
          </button>
        </div>
        {formValues.hashtags?.map((hashtag) => (
          <div>{hashtag}</div>
        ))}
        <br />
        <button
          className="upload-post"
          id="upload-post"
          name="submit"
          type="submit"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default PostForm
