import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "light",
    token: null,
    user: null,
    posts: [],
}

export const authSlice = createSlice(
    {
        name: "auth",
        initialState,
        reducers: {
            setMode: (state) => {
                state.mode = state.mode === "light" ? "dark" : "light";
            },
            setLogin: (state, action) => {
                state.token = action.payload.token;
                state.user = action.payload.user;
            },
            setLogout: (state) => {
                state.token = null;
                state.user = null;
            },
            setFriends:(state,action)=>{
                if(state.user){
                    state.user.friends = action.payload.friends;
                } else{
                    console.log("User friends non-existence");
                }
            },
            setPosts:(state, action)=>{
                state.posts = action.payload.posts
            },
            setPost: (state,action)=>{
                const updatedPosts = state.posts.map((post)=> {
                    if(post._id===action.payload.post._id) return action.payload.post;
                    return post;
                })
                state.posts=updatedPosts;
            }
        }
    })

    export const {setMode,setLogin,setLogout,setFriends,setPost,setPosts}=authSlice.actions;
    export default authSlice.reducer