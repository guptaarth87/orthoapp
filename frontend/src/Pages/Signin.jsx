import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import API_URL from '../_helpers';
import './AuthForm.css'; // Import custom CSS

const Signin = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`${API_URL}/signin`, data);
            if (response.data.status === 'success') {
                Cookies.set('email', data.email);
                Cookies.set('password', data.password);
                navigate('/index');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert('An error occurred: ' + error.response.data.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="text-center poppins-semibold">Signin</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                    <div className="form-group">
                        <label className='poppins-medium'>Email</label>
                        <input 
                            type="email" 
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
                            {...register('email', { required: 'Email is required' })} 
                        />
                        {errors.email && <p className="invalid-feedback">{errors.email.message}</p>}
                    </div>
                    <div className="form-group mt-3">
                        <label className='poppins-medium'>Password</label>
                        <input 
                            type="password" 
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`} 
                            {...register('password', { required: 'Password is required' })} 
                        />
                        {errors.password && <p className="invalid-feedback">{errors.password.message}</p>}
                    </div>
                    <button type="submit" className="btn btn-primary btn-block mt-4 poppins-medium">Signin</button>
                </form>
                <p className="text-center mt-3 poppins-light">Don't have an account? <a href="/signup">Signup</a></p>
            </div>
        </div>
    );
};

export default Signin;
