import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useHistory } from 'react-router-dom'

function AddStudent() {
    
    const history = useHistory()

    const formSchema = yup.object().shape({
        firstName: yup
        .string()
        .matches(/^[a-zA-Z\']+$/, "First name can not contain numbers or special characters, except an apostrophe")
        .required("First name is required"),
        lastName: yup
        .string()
        .matches(/^[a-zA-Z\-]+$/, "Last name can not contain numbers or special characters, except a hyphen")
        .required("Last name is required"),
      });

    const formik = useFormik({
        initialValues: {
          firstName: "",
          lastName: "",
          grade: "",
        },
        validationSchema: formSchema,
        onSubmit: (values, { resetForm }) => {
          fetch("http://127.0.0.1:5555/students", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values, null, 2),
            credentials: 'include'
        })
        .then(res => {
            if (res.ok) {
                res.json().then(
                    data => {console.log(data)
                alert("Student successfully added!")
                resetForm()
                history.push('/')
            })
            }
            else {
                console.log("error: " + res)
            }
        });
    }
    });
   
    return(
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="first-name">First Name: </label>
                    <div>
                        <input 
                        type="text" 
                        placeholder="Enter first name" 
                        name="firstName"
                        id="first-name" 
                        value={formik.values.firstName} 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}/>
                        {formik.touched.firstName && formik.errors.firstName ? (
                        <p style={{ color: "red" }}>{formik.errors.firstName}</p>
                        ) : null}
                    </div>
                    <label htmlFor="last-name">Last Name: </label>
                    <div>
                        <input type="text" 
                        placeholder="Enter last name" 
                        name="lastName"
                        id="last-name" 
                        value={formik.values.lastName} 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}/>
                        {formik.touched.lastName && formik.errors.lastName ? (
                        <p style={{ color: "red" }}>{formik.errors.lastName}</p>
                        ) : null}
                    </div>
                    <label htmlFor="grade">Grade: </label>
                    <div>
                        <select type="dropdown" 
                        name="grade"
                        id="grade" 
                        value={formik.values.grade} 
                        onChange={formik.handleChange}>
                            <option value="default">Select One</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                        </select>
                    </div>
                    <div>
                        <p></p>
                        <button type="submit">Submit</button>
                    </div>
        </form>
    )
}

export default AddStudent