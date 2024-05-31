import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../App.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../helpers/AuthContext";
import { BASE_URL } from './site';
function Login() {
    const navigate = useNavigate();
    const { setAuthState } = useContext(AuthContext);

    const initialValues = {
        email: "",
        password: ""
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email format").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
    });

    const onSubmit = (values, { setSubmitting, resetForm, setFieldError }) => {
        axios.post(`${BASE_URL}api/login`, values)
            .then(response => {
                console.log(response.data);
                if (response.data.error) {
                    alert(response.data.error);
                } else {
                    localStorage.setItem("accessToken", response.data.token);
                    setAuthState({
                        username: response.data.username,
                        id: response.data.id,
                        status: true
                    });
                    resetForm();
                    navigate('/'); 
                }
            })
            .catch(error => {
                if (error.response) {
                    
                    if (error.response.status === 404 || error.response.status === 401) {
                        setFieldError('general', error.response.data.error);
                    } else {
                        setFieldError('general', 'An error occurred. Please try again.');
                    }
                } else if (error.request) {
                    setFieldError('general', 'No response from server. Please try again.');
                } else {
                    setFieldError('general', 'An error occurred. Please try again.');
                }
                console.error('Error logging in:', error);
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    return (
        <div>
        <div>
            <h1 className='helloji'>Login</h1>
            <div className='lr_1'>
            <Formik className="lr_2" initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                {({ isSubmitting, errors }) => (
                    <Form className="lr_3">
                        <div className="lr_4">
                            <label className='lr_label' htmlFor="email">Email:</label>
                            <Field id="email" name="email" placeholder="Enter your email" type="email" />
                            <ErrorMessage name="email" component="div" className="lr_5" />
                        </div>

                        <div className="lr_4">
                            <label className='lr_label' htmlFor="password">Password:</label>
                            <Field id="password" name="password" placeholder="Enter your password" type="password" />
                            <ErrorMessage name="password" component="div" className="lr_5" />
                        </div>

                        {errors.general && (
                            <div className="error-message">{errors.general}</div>
                        )}

                        <button type="submit" disabled={isSubmitting}>Login</button>

                    </Form>
                )}
            </Formik>
        </div>
        
        </div>
        <footer class="footer">
  <div class="footer-content">
    <p>&copy; 2024 Barca Book. All rights reserved.</p>
  </div>
</footer>
        </div>
    );
}

export default Login;
