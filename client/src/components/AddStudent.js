import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from 'react-router-dom'
import { StudentContext } from "./MyContext.js";

function AddStudent() {
    
    const navigate = useNavigate()
    const { students, setStudents } = useContext(StudentContext);

    const formSchema = yup.object().shape({
        first_name: yup
        .string()
        .matches(/^[a-zA-Z\']+$/, "First name can not contain numbers or special characters, except an apostrophe")
        .required("First name is required"),
        last_name: yup
        .string()
        .matches(/^[a-zA-Z\-]+$/, "Last name can not contain numbers or special characters, except a hyphen")
        .required("Last name is required"),
        grade: yup.number().required("Grade is required"),
      });

    const formik = useFormik({
        initialValues: {
          first_name: "",
          last_name: "",
          grade: "",
        },
        validationSchema: formSchema,
        onSubmit: (values, { resetForm }) => {
          fetch("https://eduplan.onrender.com/students", {
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
                        name="first_name"
                        id="first_name" 
                        value={formik.values.first_name} 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}/>
                        {formik.touched.first_name && formik.errors.first_name ? (
                        <p style={{ color: "red" }}>{formik.errors.first_name}</p>
                        ) : null}
                </div>
                <div className="pr-44 text-2xl py-4">
                    <label htmlFor="last-name">Last Name: </label>
                        <input type="text" 
                        placeholder="Enter last name" 
                        name="last_name"
                        id="last_name" 
                        value={formik.values.last_name} 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}/>
                        {formik.touched.last_name && formik.errors.last_name ? (
                        <p style={{ color: "red" }}>{formik.errors.last_name}</p>
                        ) : null}
                    </div>
            </div>
                <div className="text-2xl pb-10">
                    <label htmlFor="grade">Grade: </label>
                        <select type="dropdown" 
                        name="grade"
                        id="grade" 
                        value={formik.values.grade} 
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}>
                            <option value="default">Select One</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                        </select>
                        {formik.touched.grade && formik.errors.grade ? (
                        <p style={{ color: "red" }}>{formik.errors.grade}</p>
                        ) : null}
                </div>
                <div className="justify-end">
                    <button type="submit" className="bg-slate-700 text-white text-xl">SUBMIT</button>
                </div>
        </form>
    )
}

export default AddStudent