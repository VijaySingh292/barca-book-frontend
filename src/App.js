import React, { useState, useEffect } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from "./pages/home";
import CreatePost from "./pages/createpost";
import Post from "./pages/post";
import Login from "./pages/login";
import Register from "./pages/register";
import PageNotFound from "./pages/pagenotfound";
import Profile from "./pages/profile";
import { AuthContext } from "./helpers/AuthContext";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { BASE_URL } from "./pages/site";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });
  useEffect(() => {
    const storedAuthState = localStorage.getItem("authState");
    if (storedAuthState) {
      setAuthState(JSON.parse(storedAuthState));
    } else {
      axios.get(`${BASE_URL}api/auth`, {
        headers: {
          accessToken: localStorage.getItem('accessToken')
        }
      }).then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
          localStorage.removeItem("authState"); 
        } else {
          const newAuthState = {
            username: response.data.email,
            id: response.data.id,
            status: true,
          };
          setAuthState(newAuthState);
          localStorage.setItem("authState", JSON.stringify(newAuthState)); 
        }
      }).catch((error) => {
        console.error("Error fetching auth state from server:", error);
      });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authState");
    setAuthState({ username: "", id: 0, status: false });
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            {authState.status ? (
              <>
                <Link to="/">Home</Link>
                <Link to="/createpost">Create a Post</Link>
                <h1><Link to={`/profile/${authState.id}`}>{authState.username}</Link></h1>
                <button className="hello" onClick={logout}><Link to="/login">LogOut</Link></button>

              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="/profile/:id" element={<Profile />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    
    </div>
  );
}

export default App;
