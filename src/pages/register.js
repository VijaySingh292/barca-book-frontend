import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from './site';
export default function Register() {
    const initialValues = {
        email: "",
        password: ""
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email format").required("You must input an email"),
        password: Yup.string().required("You must input a password")
    });

    const navigate = useNavigate(); 

    const onSubmit = (values, { resetForm }) => {
        axios.post(`${BASE_URL}api/users`, values)
            .then(response => {
                console.log(response);
                resetForm(); 
                navigate("/login"); 
            })
            .catch(error => {
                console.error('Error creating user:', error);
            });
    };

    return (
        <div>
        <div>
        <h1 className='helloji_1'>Hello and Welcome to The Barca Book</h1>
        <h2 className='helloji_2'>I hope you'll enjoy posting some good stuffs about FC Barcelona</h2>
        <h3 className='helloji_3'>Register Here</h3>
 
        <div className='lr_1'>
            <Formik className="lr_2" initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                <Form className="lr_3">
                <div className='lr_4'>
                    <label className='lr_label'>Email :</label>
                    <ErrorMessage className='lr_5' name="email" component="span" />
                    <Field
                        id="email"
                        name="email"
                        placeholder="Ex. Email..."
                    />
                    </div>
                    <div className='lr_4'>
                    <label className='lr_label'>Password :</label>
                    <ErrorMessage className="lr_5" name="password" component="span" />
                    <Field  
                        id="password"
                        name="password"
                        placeholder="Ex. Password..."
                        type="password"
                    />
                    </div>
                    <button type="submit">Register</button>
                </Form>
            </Formik>
        </div>
        </div>
        <footer class="footer">
  <div class="footer-content">
    <p>&copy; 2024 Barca Book. All rights reserved.</p>
  </div>
</footer>
        </div>
    )
}
