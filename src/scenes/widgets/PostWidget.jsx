import React, { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined
} from '@mui/icons-material';
import { Avatar, Box, Divider, IconButton, TextField, Typography, useTheme } from '@mui/material';
import Friend from 'components/Friend';
import WidgetWrapper from 'components/WidgetWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { setPost,removePost } from 'state';
import FlexBetween from 'components/FlexBetween';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
export default function PostWidget({
    postId,
    postUserId,
    name,
    description,
    location,
    picturePath,
    userPicturePath,
    likes,
    comments
}) {
    const [isComment, setIsComment] = useState(false);
    const dispatch = useDispatch();
    const token = useSelector(state => state.token);
    const loggedInUserId = useSelector(state => state.user._id);
    const loggedInUserFirstName = useSelector(state => state.user.firstName);
    const loggedInUserLastName = useSelector(state => state.user.lastName);
    const loggedInUserPicturePath = useSelector(state => state.user.picturePath);
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;
    const [commentText, setCommentText] = useState("");
   
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;

    const cloudPostPicturePath = `https://res.cloudinary.com/ddrbtlpxj/${picturePath}`;
    // ADD AND REMOVE LIKE
    const patchLike = async () => {
        const response = await fetch(`https://connectserver.onrender.com/posts/${postId}/like`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: loggedInUserId })
        });
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
    };

    // ADD COMMENT
    const addComment = async () => {
        const response = await fetch(`https://connectserver.onrender.com/posts/${postId}/addComment`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId: loggedInUserId, text: commentText, picturePath: loggedInUserPicturePath, name: `${loggedInUserFirstName} ${loggedInUserLastName}` })
            });
        setCommentText("");
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
    };

    // DELETE COMMENT
    const deleteComment = async (commentId) => {
        const response = await fetch(`https://connectserver.onrender.com/posts/${postId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ commentId })
        });
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
    }

    //DELETE POST
    const deletePost = async (postId,picturePath) => {
        const response = await fetch(`https://connectserver.onrender.com/posts/${postId}/delete`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body:JSON.stringify({picturePath})
        });
        if (response.status === 200) {
            dispatch(removePost(postId));
        }

    }
    return (
        <WidgetWrapper m="2rem 0">
            <Friend
                friendId={postUserId}
                name={name}
                subtitle={location}
                userPicturePath={userPicturePath}
            />
            <Typography color={main} sx={{ mt: "1rem" }}>
                {description}
            </Typography>
            {picturePath && (
                <img
                    width="100%"
                    height="auto"
                    alt="post"
                    style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
                    src={`${cloudPostPicturePath}`}
                />
            )}
            <FlexBetween mt="0.25rem">
                <FlexBetween gap="1rem">

                    <FlexBetween gap="0.3rem">
                        <IconButton onClick={patchLike}>
                            {isLiked ? (
                                <FavoriteOutlined sx={{ color: primary }} />
                            ) : <FavoriteBorderOutlined />}
                        </IconButton>
                        <Typography>{likeCount}</Typography>
                    </FlexBetween>

                    <FlexBetween gap="0.3rem">
                        <IconButton onClick={() => setIsComment(!isComment)}>
                            <ChatBubbleOutlineOutlined />
                        </IconButton>
                        <Typography>{comments.length}</Typography>
                    </FlexBetween>
                </FlexBetween>

                {postUserId===loggedInUserId && (<IconButton onClick={() => {
                    deletePost(postId,picturePath);
                }}>
                    <DeleteForeverTwoToneIcon style={{ fontSize: "1.8rem" }} />
                </IconButton>)}


            </FlexBetween>
            {/* Displaying Comments */}
            {isComment && (
                <Box
                    mt="0.5rem">
                    {comments.map(
                        (comment, i) => (
                            <Box key={`${name}-${i}`}>
                                <Divider />
                                <FlexBetween>
                                    <FlexBetween gap="2rem" justifyContent="flex-start">
                                        <Avatar alt={comment.name} src={`https://res.cloudinary.com/ddrbtlpxj/${comment.picturePath}`}
                                            sx={{ m: "0.5rem 0" }} />
                                        <Typography sx={{ color: main, m: "0.5rem 0", pl: "0rem" }}>
                                            {comment.text}
                                        </Typography>

                                    </FlexBetween>
                                    {(comment.commentBy === loggedInUserId || postUserId === loggedInUserId) && (<IconButton onClick={() => {
                                        deleteComment(comment._id)
                                    }}>
                                        <DeleteOutlineIcon style={{ color: primary }} />
                                    </IconButton>)}
                                </FlexBetween>

                            </Box>
                        )
                    )}
                    <Divider />
                    <FlexBetween>
                        <TextField fullWidth placeholder='Add a comment' sx={{ m: "0.5rem" }} onChange={(e) => {
                            setCommentText(e.target.value);
                        }}

                            value={commentText} />
                        <IconButton onClick={addComment}>
                            <SendIcon style={{ color: primary, fontSize: "1.8rem" }} />
                        </IconButton>
                    </FlexBetween>

                </Box>
            )}
        </WidgetWrapper>
    )
}