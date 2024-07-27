import React, { useState } from 'react'
import { useFormik } from "formik";
import * as yup from "yup";


function SignUp({ onLogin }) {
    
    const [refreshPage, setRefreshPage] = useState(false);
    
    const formSchema = yup.object().shape({
        userName: yup
        .string()
        .matches(/^[a-zA-Z0-9]+$/, "Username can only contain alphanumeric characters")
        .min(6, "Must be at least 6 characters")
        .required("Username is required"),
        password: yup
        .string()
        .min(7, "Must be at least 7 characters")
        .required("Password is required"),
        confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
        firstName: yup.string().required("Must enter a first name").max(15),
        lastName: yup.string().required("Must enter a last name").max(20)
      });

    const formik = useFormik({
        initialValues: {
          firstName: "",
          lastName: "",
          userName: "",
          password: "",
          confirmPassword: ""
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
          fetch("http://127.0.0.1:5555/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values, null, 2)
        })
        .then(res => {
            if (res.ok) {
                res.json().then(user => onLogin(user))
                setRefreshPage(!refreshPage);
            }
            else {
                console.log("error: " + res)
            }
        });
    }
    });
    return (
    <div>
            <main>
                <h1>Sign Up</h1>
                <form onSubmit={formik.handleSubmit}>
                    <label htmlFor="first_name">First Name: </label>
                    <div>
                        <input type="text" 
                        id="first_name" 
                        name="firstName"
                        value={formik.values.firstName} 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}/>
                        {formik.touched.firstName && formik.errors.firstName ? (
                        <p style={{ color: "red" }}>{formik.errors.firstName}</p>
                        ) : null}
                    </div>
                    <label htmlFor="last_name">Last Name: </label>
                    <div>
                        <input type="text" 
                        id="last_name" 
                        name="lastName"
                        value={formik.values.lastName} 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}/>
                        {formik.touched.lastName && formik.errors.lastName ? (
                        <p style={{ color: "red" }}>{formik.errors.lastName}</p>
                        ) : null}
                    </div>
                    <label htmlFor="username">Username: </label>
                    <div>
                        <input type="text" 
                        id="username" 
                        name="userName"
                        value={formik.values.userName} 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}/>
                        {formik.touched.userName && formik.errors.userName ? (
                        <p style={{ color: "red" }}>{formik.errors.userName}</p>
                        ) : null}
                    </div>
                    <label htmlFor="password">Password: </label>
                    <div>
                        <input type="password" 
                        id="password" 
                        name="password"
                        value={formik.values.password} 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}/>
                        {formik.touched.password && formik.errors.password ? (
                        <p style={{ color: "red" }}>{formik.errors.password}</p>
                        ) : null}
                    </div>
                    <label htmlFor="password">Confirm password: </label>
                    <div>
                        <input type="password" 
                        id="confirm-password" 
                        name="confirmPassword"
                        value={formik.values.confirmPassword} 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}/>
                        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                        <p style={{ color: "red" }}>{formik.errors.confirmPassword}</p>
                        ) : null}
                    </div>
                    <div>
                        <p></p>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </main>
        </div>
    )
}

export default SignUp