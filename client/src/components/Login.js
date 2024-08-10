import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import SignUp from './SignUp'
import { useFormik } from "formik";
function Login({ onLogin }) {
    
    const [showComponent, setShowComponent] = useState(false);
    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
          userName: "",
          password: "",
        },
        onSubmit: (values) => {
        fetch("http://127.0.0.1:5555", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values, null, 2),
            credentials: 'include'
        })
        .then(res => {
            if (res.ok) {
                res.json().then(user => onLogin(user))
            }
            else {
                throw new Error('Error fetching student data');
            }
        })
        .catch(error => {
            console.error('Error updating student:', error)})
    }
})
    function handleClick() {
        setShowComponent(true); // Set showComponent to true when the button is clicked
    }

    return (
        <div>
            <main>
                <h1>Sign In</h1>
                <form onSubmit={formik.handleSubmit}>
                    <label htmlFor="username">Username</label>
                    <div>
                        <input 
                        type="text" 
                        placeholder="Username"
                        name="userName" 
                        id="username" 
                        value={formik.values.userName} 
                        onChange={formik.handleChange}/>
                    </div>
                    <label htmlFor="password">Password</label>
                    <div>
                        <input type="password" 
                        name="password"
                        id="password" 
                        value={formik.values.password} 
                        onChange={formik.handleChange}/>
                    </div>
                    <div>
                        <p></p>
                        <button type="submit">Submit</button>
                    </div>
                </form>
                <p>Or, if you don't have an account...</p>
                    <div>
                        <button onClick={handleClick}>Sign Up</button>
                        {showComponent && <SignUp onLogin={onLogin} />}
                    </div>
            </main>
        </div>
    )
}

export default Login