import React from 'react'
import { useSelector } from 'react-redux';
import {Link} from 'react-router-dom'
import PostAuthor from './PostAuthor';
import TimeAgo from './TimeAgo';
import ReactionButtons from './ReactionButtons';
import { selectPostById } from './postsSlice';
const PostsExcrept = ({postId}) => {
  const post = useSelector( state => selectPostById(state, +postId) )
  return (
    <article key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body.substring(0, 50)} ...</p>
            <p>
               <Link to={`post/${post.id}`}>View Post</Link> 
              <PostAuthor userId = {post.userId} />
              <TimeAgo timestamp={post.date} />
            </p>
            <ReactionButtons post={post} />
    </article>
  )
}

export default PostsExcrept