import React, { useContext, useEffect } from 'react';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';
import {BASE_URL} from "./site";

function CreatePost() {
    const { authState } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/login");
        }
    }, [authState.status, navigate]);

    const initialValues = {
        title: "",
        post_text: "",
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("You must input a title"),
        post_text: Yup.string().required("Post text is required"),
    });

    const onSubmit = (values, { resetForm }) => {
        axios.post(`${BASE_URL}`, values, { headers: { accessToken: localStorage.getItem("accessToken") } })
            .then(response => {
                console.log(response);
                resetForm();
                navigate("/");
            })
            .catch(error => {
                console.error('Error creating post:', error);
            });
    };

    return (
        <div>
        <div className="createPostPage">
            <h1>Create a New Post</h1>
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
            <Form className="formContainer">
                <div className="formField">
                    <label htmlFor="title">Title:</label>
                    <ErrorMessage name="title" component="span" />
                    <Field id="title" name="title" placeholder="Enter title..." />
                </div>

                <div className="formField">
                    <label htmlFor="post_text">Post:</label>
                    <ErrorMessage name="post_text" component="span" />
                    <Field id="post_text" name="post_text" placeholder="Enter post..." />
                </div>

                <div className="formField">
                    <button type="submit">Create Post</button>
                </div>
            </Form>
        </Formik>
        </div>
        <footer class="footer">
  <div class="footer-content">
    <p>&copy; 2024 Barca Book. All rights reserved.</p>
  </div>
</footer>
        </div>
    );
}

export default CreatePost;
