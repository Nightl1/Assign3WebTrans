import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const redirectToMoviesPage = () => {
        window.location.href = '/Part3'; // Redirect to Movies page
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Validation before sending data to server
        const emailRegex = /[A-Za-z0-9_-]+@[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/;
        const emailTest = emailRegex.test(email);

        const passwordSizeRegex = /.{6,}/;
        const passwordSpecialCharactersRegex = /[^A-Za-z0-9]+/;
        const passwordTest = passwordSizeRegex.test(password) && passwordSpecialCharactersRegex.test(password);

        // For demonstration purposes, let's just check if the fields are not empty
        if (emailTest && passwordTest) {
            try {
                const response = await fetch('http://localhost:5000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                });

                if (response.ok) {
                    const token = await response.text(); // Get the JWT token
                    localStorage.setItem('token', token); // Store the token in localStorage
                    redirectToMoviesPage(); // Redirect to Movies page after successful login
                } else {
                    const errorData = await response.json();
                    toast.error(errorData.message || "An error occurred during login. Please try again later.");
                }
            } catch (error) {
                console.error("Login error:", error);
                toast.error("An error occurred during login. Please try again later.");
            }
        } else {
            // error
            toast.error("Please correctly fill in all fields");
        }
    };

    return (
        <div>
            <h2 className='title'>Log in to your account</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        id="emailInput"
                        className="inputField"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Email"
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        id="passwordInput"
                        className="inputField"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Password"
                        required
                    />
                </div>
                <button type="submit" className="submitButton">Login</button>
            </form>
            <div>
                <p className='RegisteredQ'>Not registered yet? <Link to="/" className="loginLink">Register here</Link>.</p>
            </div>
            <ToastContainer />
        </div>
    );
};

export default LoginForm;
