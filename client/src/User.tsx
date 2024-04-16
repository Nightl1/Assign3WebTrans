import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterForm: React.FC = ({ }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [favoriteGenre, setFavoriteGenre] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);


    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
    }; 

    const handleFavoriteGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        console.log("Selected genre:", event.target.value);
        setFavoriteGenre(event.target.value);
    };
    
    

    const handleTermsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTermsAccepted(event.target.checked);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        // Validation before sending data to server
        const emailRegex = /[A-Za-z0-9_-]+@[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/;
        const emailTest = emailRegex.test(email);
    
        const passwordSizeRegex = /.{6,}/;
        const passwordSpecialCharactersRegex = /[^A-Za-z0-9]+/;
        const passwordTest = passwordSizeRegex.test(password) && passwordSpecialCharactersRegex.test(password);
    
        const passwordsMatch = password === confirmPassword;
    
        if (!emailTest || !passwordTest || !passwordsMatch || !favoriteGenre || !termsAccepted) {
            toast.error("Please correctly fill in all fields");
            return;
        }
    
        try {
            console.log("Form data:", {
                email,
                password,
                genre: favoriteGenre,
            });
    
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    genre: favoriteGenre,
                }),
            });
    
            console.log("Server response:", response);
    
            const data = await response.json();
            if (response.status === 201) {
                toast("Register Successfully");
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setFavoriteGenre('');
                setTermsAccepted(false);
            } else {
                toast.error(data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            toast.error("An error occurred during registration. Please try again later.");
        }
    };
    

    return (
        <div>
            <h2 className='title'>Create a new account!</h2>
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

                <div>
                    <input
                        type="password"
                        id="confirmPasswordInput"
                        className="inputField"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        placeholder="Confirm Password"
                        required
                    />
                </div>

                <div>
                    <select
                        id="favoriteGenreSelect"
                        className="selectField"
                        value={favoriteGenre}
                        onChange={handleFavoriteGenreChange}
                        style={{ width: "73%" }}
                        required
                    >
                        <option value="" disabled>Select a movie genre</option>
                        <option value="Action">Action</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Animation">Animation</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Drama">Drama</option>
                        <option value="Horror">Horror</option>
                        <option value="History">History</option>
                        <option value="Romance">Romance</option>
                        {/* <option value="Sci-fi">Science Fiction</option> */}

                        {/* Add more options as needed */}
                    </select>
                </div>

                <div>
                    <input
                        type="checkbox"
                        id="termsAcceptedCheckbox"
                        className="checkboxField"
                        checked={termsAccepted}
                        onChange={handleTermsChange}
                    />
                    <label htmlFor="termsAcceptedCheckbox" className="checkboxLabel">I accept the terms and conditions</label>
                </div>

                <button type="submit" id="registerButton" className="submitButton">Register</button>

                <div>
                    <p className='RegisteredQ'>Already registered? <a href="part2" id="loginLink" className="loginLink">Log in here</a>.</p>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
};

export default RegisterForm;
