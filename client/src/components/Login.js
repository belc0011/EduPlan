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
                <h1 className="bg-slate-700 text-white italic text-7xl py-10">EduPlan 504 Organizer</h1>
                <h1 className="text-3xl py-5 font-bold">Sign In</h1>
                <form onSubmit={formik.handleSubmit}>
                    <div className="py-5">
                        <label htmlFor="username" className="text-2xl italic pr-5">Username: </label>
                            <input 
                            type="text" 
                            placeholder="Username"
                            name="userName" 
                            className="text-2xl border-2"
                            id="username" 
                            value={formik.values.userName} 
                            onChange={formik.handleChange}/>
                    </div>
                    <div className="py-6">
                        <label htmlFor="password" className="text-2xl italic pr-5">Password: </label>
                            <input type="password" 
                            name="password"
                            id="password" 
                            className="text-2xl border-2"
                            value={formik.values.password} 
                            onChange={formik.handleChange}/>
                    </div>
                    <div className="py-5">
                        <button type="submit" className="border-slate-200 bg-slate-500 text-white text-xl font-semibold">SUBMIT</button>
                    </div>
                </form>
                <div className="bg-slate-200 border-2 border-slate-700">    
                    <p className="italic text-3xl py-5 text-slate-700">Or, if you don't have an account...</p>
                    <button onClick={handleClick} className="border-slate-500 text-xl font-semibold">SIGN UP</button>
                        {showComponent && <SignUp onLogin={onLogin} />}
                </div>
            </main>
        </div>
    )
}

export default Login