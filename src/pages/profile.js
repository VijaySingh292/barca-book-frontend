import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from './site';

function Profile() {
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    axios.get(`${BASE_URL}basicinfo/${id}`)
      .then((response) => {
        setUsername(response.data.email);
      })
      .catch((error) => {
        console.error("There was an error fetching the user data!", error);
      });
  }, []);

  useEffect(() => {
    if (id) {
      axios.get(`${BASE_URL}byUserId/${id}`)
        .then(({ data }) => {
          setListOfPosts(data);
        })
        .catch((error) => {
          console.error("There was an error fetching the posts!", error);
        })
        .finally(() => {
          setLoading(false); 
        });
    }
  }, [id]);
  
  return (
    <div>
    <div className='profile-container'>
      <div className='basic-info'>
        <h1>Username: {username}</h1>
      </div>
      <div className='list-of-posts'>
        {loading ? (
          <p>Loading...</p>
        ) : (
          listOfPosts.length > 0 ? (
            listOfPosts.map(post => (
              <div key={post.id_num} className='profile-container'>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>{post.title}</h2>
     <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem' }}>{post.post_text}</p>
    <p style={{ fontWeight: 'bold', color: '#333', marginBottom: '0.5rem' }}>Comments:</p>

                <div className='comments'>
                  {post.comments && post.comments.length > 0 ? (
                    post.comments.map(comment => (
                      <div key={comment.comment_id} className='comment-content'>
                        <p><small>{comment.username}</small><span> : </span><small>{comment.comment_text}</small></p>
                      </div>
                    ))
                  ) : (
                    <p>No comments</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No posts found</p>
          )
        )}
      </div>
      
    </div>
    
    </div>
  );
}

export default Profile ;