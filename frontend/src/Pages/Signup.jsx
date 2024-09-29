// Signup.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import API_URL from '../_helpers';

const Signup = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`${API_URL}/signup`, data);
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
        <div className="container mt-5 d-flex justify-content-center">
            <div className="card shadow p-4" style={{ maxWidth: '500px', width: '100%', borderRadius: '10px', backgroundColor: '#f8f9fa' }}>
                <h2 className="text-center poppins-semibold">Signup</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                    <div className="form-group">
                        <label className="poppins-medium">Name</label>
                        <input 
                            type="text" 
                            className="form-control shadow-sm"
                            {...register('name_', { required: 'Name is required' })}
                        />
                        {errors.name_ && <p className="text-danger">{errors.name_.message}</p>}
                    </div>
                    <div className="form-group mt-3">
                        <label className="poppins-medium">Phone Number</label>
                        <input 
                            type="text" 
                            className="form-control shadow-sm"
                            {...register('phoneNo', { required: 'Phone number is required' })}
                        />
                        {errors.phoneNo && <p className="text-danger">{errors.phoneNo.message}</p>}
                    </div>
                    <div className="form-group mt-3">
                        <label className="poppins-medium">Email</label>
                        <input 
                            type="email" 
                            className="form-control shadow-sm"
                            {...register('email', { required: 'Email is required' })}
                        />
                        {errors.email && <p className="text-danger">{errors.email.message}</p>}
                    </div>
                    <div className="form-group mt-3">
                        <label className="poppins-medium">Password</label>
                        <input 
                            type="password" 
                            className="form-control shadow-sm"
                            {...register('password', { required: 'Password is required' })}
                        />
                        {errors.password && <p className="text-danger">{errors.password.message}</p>}
                    </div>
                    <button type="submit" className="btn btn-primary mt-4 w-100 poppins-medium">Signup</button>
                </form>
                <p className="text-center mt-3 poppins-light">Already have an account? <a href="/signin" className="poppins-medium">Signin</a></p>
            </div>
        </div>
    );
};

export default Signup;

// Similar updates for Signin.jsx
