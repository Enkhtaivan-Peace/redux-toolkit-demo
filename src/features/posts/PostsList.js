import React from 'react'
import { useSelector } from "react-redux";
import { selectAllPosts, getPostsError, getPostsStatus, fetchPosts, selectPostIds } from './postsSlice';
import PostsExcrept from './PostsExcrept';
const PostsList = () => {

    const orderedPostIds = useSelector(selectPostIds)

    const posts = useSelector(selectAllPosts);
    const postsStatus = useSelector(getPostsStatus);
    const error = useSelector(getPostsError);

    let content
    if(postsStatus === 'loading'){
      content = <p>"loading ..."</p>
    }else if(postsStatus ==='succeeded'){
      content = orderedPostIds.map(postId => <PostsExcrept key={postId} postId={postId} />)
      // const orderedPosts = posts.slice().sort( (a, b) =>b.date.localeCompare(a.date) )
      // content =  orderedPosts.map( post => <PostsExcrept key={post.id} post={post} />)
    }else if(postsStatus === 'failed'){
      content = <p>{error}</p>
    }

   
  return (
    <section>
        {content}
    </section>
  )
}

export default PostsList