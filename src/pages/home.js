import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { AuthContext } from '../helpers/AuthContext';
import { BASE_URL } from './site';

function Home() {
    const [posts, setPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState(new Set());
    const { authState } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/login");
        } else {
            axios.get(`${BASE_URL}post`, {
                headers: { accessToken: localStorage.getItem("accessToken") }
            })
            .then((response) => {
                setPosts(response.data);
                const likedPostsData = new Set();
                response.data.forEach(post => {
                    if (post.isLiked) { 
                        likedPostsData.add(post.id_num);
                    }
                });
                setLikedPosts(likedPostsData);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
        }
    }, [authState.status, navigate]);

    const likePost = (postId) => {
        axios.post(`${BASE_URL}api/like`, { post_id: postId }, {
            headers: { accessToken: localStorage.getItem("accessToken") }
        })
        .then((response) => {
            setPosts((prevPosts) => 
                prevPosts.map((post) => 
                    post.id_num === postId
                        ? { ...post, like_count: post.like_count + 1 }
                        : post
                )
            );
            setLikedPosts((prev) => new Set(prev).add(postId));
        })
        .catch((error) => {
            if (error.response && error.response.status === 409) {
                console.error('Error: You have already liked this post.');
            } else {
                console.error('Error liking post:', error);
            }
        });
    };

    const unlikePost = (postId) => {
        axios.delete(`${BASE_URL}api/like`, {
            data: { post_id: postId },
            headers: { accessToken: localStorage.getItem("accessToken") }
        })
        .then((response) => {
            setPosts((prevPosts) => 
                prevPosts.map((post) => 
                    post.id_num === postId
                        ? { ...post, like_count: post.like_count - 1 }
                        : post
                )
            );
            setLikedPosts((prev) => {
                const updated = new Set(prev);
                updated.delete(postId);
                return updated;
            });
        })
        .catch((error) => {
            console.error('Error unliking post:', error);
        });
    };

    return (
        <div className='split'>
        <h1 className='lol'><span className='lol1'>THE </span><span className='lol2'>BARCA </span><span className='lol3'>BOOK</span></h1>

        <div>
            {posts.length === 0 ? (
                <p>No posts available.</p>
            ) : (
                <ul >
                    {posts.map((post) => (
                        <li key={post.id_num} className='home-container blinking-div' onClick={() => navigate(`/post/${post.id_num}`)}>
                            <h2>{post.title}</h2>
                            <p>{post.post_text}</p>
                            <p>By:{post.user_name}</p>
                            <div>
                                <p>Likes: {post.like_count}</p>
                                
                                <ThumbUpAltIcon 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            likePost(post.id_num); 
                                        }}
                                        style={{ color: 'grey', cursor: 'pointer' }}
                                    />
                                    <ThumbDownAltIcon 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            unlikePost(post.id_num); 
                                        }}
                                        style={{ color: 'grey', cursor: 'pointer' }}
                                    />
                                 
                                    
                                
                            </div>    
                        </li>
                    ))}
                </ul>
            )}
        </div>
        <footer class="footer">
  <div class="footer-content">
    <p>&copy; 2024 Barca Book. All rights reserved.</p>
  </div>
</footer>

        </div>
    );
}

export default Home;
