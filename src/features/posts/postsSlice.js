import { createSlice, nanoid, createAsyncThunk , createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import {sub} from 'date-fns'
import axios from "axios";
const POST_URL = 'https://jsonplaceholder.typicode.com/posts'

const postsAdapter = createEntityAdapter({ sortComparer: (a,b) =>b.date.localeCompare(a.date) })

const initialState = postsAdapter.getInitialState({
   posts: [],
   status: 'idle', // loading, succeeded, failed
   error: null,
   count: 0  
});

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async()=>{
    try{
        const response = await axios.get(POST_URL)
        return [...response.data]
    }catch(err){
        return err.message
    }
})

export const addNewPost = createAsyncThunk( 'posts/addNewPost', async (initialPost) =>{
    try{
        const response = await axios.post(POST_URL, initialPost)
        return response.data
    }catch(err){
        return err.message
    }
})

export const updatePost = createAsyncThunk( 'posts/updatePost', async (initialPost) =>{
    const { id } = initialPost
    try{
        const response = await axios.put(`${POST_URL}/${id}`, initialPost)
        return response.data
    }catch(err){
        return initialPost; // only for testting redux
        // return err.message
    }
})

export const deletePost = createAsyncThunk( 'posts/deletePost', async (initialPost) =>{
    const { id } = initialPost
    try{
        const response = await axios.delete(`${POST_URL}/${id}`)
        if(response?.status === 200) return initialPost;
        return response.data
    }catch(err){
        return err.message
    }
})

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action){
                state.posts.push(action.payload)
            },
            prepare(title, content, userId){
                return {
                    payload: {
                        id: nanoid(),
                        title, 
                        content,
                        date: new Date().toISOString(),
                        userId,
                        reactions: { thumbsUp: 0, wow: 0, heart: 0, rocket: 0, coffee: 0 }
                    }
                }
            }
        },
        reactionAdded(state, action){
            console.log( 'reactionAdded action: ', action )
                const { postId, reaction } = action.payload
                // const existingPost = state.posts.find( post => post.id == postId )
                const existingPost = state.entities[postId]
                if(existingPost){
                    existingPost.reactions[reaction]++
                }
        },
        increaseCount(state, action){
            state.count = state.count + 1 
        }
    },
    extraReducers(builder) {
        builder
        .addCase( fetchPosts.pending, (state, action) =>{
            state.status = 'loading'
        })
        .addCase( fetchPosts.fulfilled, (state, action) =>{
            state.status = 'succeeded'
            //adding date and reactions
            let min = 1
            const loadedPosts = action.payload.map(post =>{
                post.date = sub(new Date(), { minutes: min ++ }).toISOString()
                post.reactions = {
                    thumbsUp: 0, wow: 0, heart: 0, rocket: 0, coffee: 0
                }
                return post;
            });
            // add any fetched posts to the array
            //  state.posts = state.posts.concat(loadedPosts)
           postsAdapter.upsertMany(state, loadedPosts)
        })
        .addCase(fetchPosts.rejected, (state, action) =>{
            state.status = 'failed'
            state.error = action.error.message
        })
        .addCase(addNewPost.fulfilled, (state, action ) =>{
            action.payload.userId = Number(action.payload.userId)
            action.payload.date = new Date().toISOString()
            action.payload.reactions = {
                thumbsUp: 0,
                hooray: 0,
                heart: 0,
                rocket: 0,
                eyes: 0
            }
            // state.posts.push(action.payload)
            postsAdapter.addOne(state, action.payload)
        })
        .addCase( updatePost.fulfilled, (state, action) =>{
            if(!action.payload?.id){
                console.log('update couldnt complete')
                console.log(action.payload)
                return    
            }
            // const {id} = action.payload
            action.payload.date = new Date().toISOString()
            // const posts = state.posts.filter( post => post.id !==id )
            // state.posts = [...posts, action.payload]
            postsAdapter.upsertOne(state, action.payload)
        })
        .addCase( deletePost.fulfilled, (state, action) =>{
            if(!action.payload?.id){
                console.log('delete couldnt complete')
                console.log(action.payload)
                return
            }
            const {id} = action.payload
            // const posts = state.posts.filter(post =>post.id !== id)
            // state.posts = posts;
            postsAdapter.removeOne(state, id)
        })
    }
});

//export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const getCount = (state) => state.posts.count;

export const {  
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
} = postsAdapter.getSelectors(state => state.posts)
// export const selectPostById = (state, postId) => state.posts.posts.find( post => post.id == postId )
export const selectPostsByUser = createSelector( [selectAllPosts, (state, userId) => +userId], (posts, userId) => posts.filter(post => post.userId === +userId)) // optimize хийгдсэн selector


export const { increaseCount, postAdded, reactionAdded } = postsSlice.actions

export default postsSlice.reducer
