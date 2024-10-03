import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from 'react-router-dom'
import { StudentContext } from "./MyContext.js";

function AddStudent() {
    
    const navigate = useNavigate()
    const { students, setStudents } = useContext(StudentContext);

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
                    data => {setStudents(prevStudents => [...prevStudents, data])
                resetForm()
            })
            }
            else {
                console.log("error: " + res)
            }
        });
    }
    });
   
    return(
        <form onSubmit={formik.handleSubmit} className="bg-slate-200 border-2 border-double border-slate-700 py-5">
            <div className="grid grid-cols-2">
                <div className="pl-44 text-2xl py-4">
                    <label htmlFor="first-name">First Name: </label>
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
                <div className="pr-44 text-2xl py-4">
                    <label htmlFor="last-name">Last Name: </label>
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
            </div>
                <div className="text-2xl pb-10">
                    <label htmlFor="grade">Grade: </label>
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
                <div className="justify-end">
                    <button type="submit" className="bg-slate-700 text-white text-xl">SUBMIT</button>
                </div>
        </form>
    )
}

export default AddStudent