import React from 'react'
import {Link} from 'react-router-dom'
import PostAuthor from './PostAuthor';
import TimeAgo from './TimeAgo';
import ReactionButtons from './ReactionButtons';
const PostsExcrept = ({post}) => {
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