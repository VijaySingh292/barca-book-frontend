import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from "../helpers/AuthContext";
import {Link} from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { BASE_URL } from './site';

function Post() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const { authState } = useContext(AuthContext);

    useEffect(() => {
        axios.get(`${BASE_URL}byId/${id}`)
            .then((response) => {
                setPost(response.data.post);
                setComments(response.data.comments);
            })
            .catch((error) => {
                console.error('Error fetching post:', error);
            });
    }, [id]);

    const addComment = () => {
        axios.post(`${BASE_URL}comment`, 
            {
                post_id: id, 
                comment_text: newComment
            },
            {
                headers: {
                    accessToken: localStorage.getItem("accessToken")
                }
            }
        ).then((response) => {
            if (response.data.error) {
                alert(response.data.error);
            } else {
                const commentToAdd = {
                    comment_id: response.data.comment_id,
                    comment_text: newComment,
                    username: response.data.username
                };
                setComments([...comments, commentToAdd]);
                setNewComment("");
            }
        }).catch((error) => {
            console.error('Error adding comment:', error);
        });
    };

    const deletePost = (postId) => {
        axios.delete(`${BASE_URL}post/${postId}`, {
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        }).then(() => {
            setPost(null); 
        }).catch((error) => {
            console.error('Error deleting Post', error);
        });
    };

    const deleteComment = (commentId) => {
        axios.delete(`${BASE_URL}comment/${commentId}`, {
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        }).then(() => {
            setComments(comments.filter((comment) => comment.comment_id !== commentId));
        }).catch((error) => {
            console.error('Error deleting comment:', error);
        });
    };

    const editPost = (option) => {
        if (option === "title") {
            let newTitle = prompt("Enter the new Title");
            if (newTitle) {
                axios.put(`${BASE_URL}posts/title`, {
                    newtitle: newTitle,
                    id: id
                }, {
                    headers: {
                        accessToken: localStorage.getItem("accessToken")
                    }
                }).then(() => {
                    setPost({ ...post, title: newTitle });
                }).catch((error) => {
                    console.error('Error updating post title:', error);
                });
            }
        } else {
            let newText = prompt("Enter the new Text");
            if (newText) {
                axios.put(`${BASE_URL}posts/text`, {
                    newtext: newText,
                    id: id
                }, {
                    headers: {
                        accessToken: localStorage.getItem("accessToken")
                    }
                }).then(() => {
                    setPost({ ...post, post_text: newText });
                }).catch((error) => {
                    console.error('Error updating post text:', error);
                });
            }
        }
    }
    

    return (
        <div>
        <div className='post-container'>
            {post && (
                <div className='postPage'>
                    <div className="title" onClick= {() => { if(authState.username === post.user_name) {editPost ("title")}}}>{post.title}</div>
                    <div className="text" onClick={ () => {if(authState.username === post.user_name){editPost("Text")}}}>{post.post_text}</div>
                    <div className='username'>By: <Link style={{ color: 'lightblue' }} to={`/profile/${post.user_id}`}>{post.user_name}</Link></div>
                    {(authState.username === post.user_name) &&
                        <button className="comment-button"  onClick={() => deletePost(post.id_num)}>Delete Post</button>}
                </div>
            )}
            <div className='comment-up'>
                <h2>Comments:</h2>
                {comments.length > 0 ? (
                    <ul className='comment-top'>
                        {comments.map((comment) => (
                            <li className="comment-border" key={comment.comment_id}>
                                <strong>{comment.username}:</strong> {comment.comment_text}
                                {(authState.username === comment.username) && (
                                    <IconButton aria-label="delete" onClick={() => deleteComment(comment.comment_id)}>
                                    <DeleteIcon className="comment-button" />
                                    </IconButton>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No comments yet</p>
                )}
                <div className='input-size'>
                <input 
                    className='comment-input'
                    type="text" 
                    placeholder="Comment" 
                    value={newComment} 
                    autoComplete="off" 
                    onChange={(event) => setNewComment(event.target.value)}
                />
                <Button variant="contained" color="primary" onClick={addComment}>Submit</Button></div>
            </div>    
        </div>
        </div>
    );
}

export default Post ;
