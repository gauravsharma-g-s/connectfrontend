import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";

export default function PostsWidget({userId,isProfile=false}) {
    console.log("i am in PostsWidget")
    const dispatch = useDispatch();
    const posts = useSelector(state=>state.posts  );
    console.log(posts);
    const token = useSelector(state=>state.token);
    console.log(token);
    // GET ALL POSTS
    const getPosts = async()=>{
        const response = await fetch("https://connectserver.onrender.com/posts",{
            method:"GET",
            headers:{Authorization: `Bearer ${token}`}
        });
        const data = await response.json();
        dispatch(setPosts({posts:data}));
    };
    // GET USER POSTS
    const getUserPosts = async()=>{
        const response = await fetch(`https://connectserver.onrender.com/posts/${userId}/posts`,{
            method:"GET",
            headers:{Authorization: `Bearer ${token}`}
        });
        const data = await response.json();
        dispatch(setPosts({posts:data}));
    };
    useEffect(()=>{
        console.log("i am useEffect");
        if(isProfile){
            getUserPosts()
        } else{
            getPosts();
        }
    },[]); // eslint-disable-line react-hooks/exhaustive-deps
    
  return (
    <>
    {
        posts.map(
            ({
                _id,
                userId,
                firstName,
                lastName,
                description,
                location,
                picturePath,
                userPicturePath,
                likes,
                comments
            }) => (
                <PostWidget
                  key={_id}
                  postId={_id}
                  postUserId={userId}
                  name={`${firstName} ${lastName}`}
                  description={description}
                  location={location}
                  picturePath={picturePath}
                  userPicturePath={userPicturePath}
                  likes={likes}
                  comments={comments}
                />
            )
        )
    }
    </>
  )
}
