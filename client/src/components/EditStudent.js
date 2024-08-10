import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import { useFormik } from "formik";
import * as yup from "yup";

function EditStudent() {
    const location = useLocation()
    const url = location.pathname
    const parts = url.split("/")
    const id = parts[2]
    const [studentToDisplay, setStudentToDisplay] = useState({})
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Need to store the student to display in a state variable "studentToDisplay" and use that state variable to display data, not make a fetch request

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
          fetch(`http://127.0.0.1:5555/students/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values, null, 2),
            credentials: 'include'
        })
        .then(res => {
            if (res.ok) {
                res.json().then(data => {setStudentToDisplay(data)
                navigate('/students')
                resetForm()})
            }
            else {
                console.log("error: " + res)
            }
        })
        .catch(error => {
            console.error('Error updating student:', error)})
    }
    });
    return (
        studentToDisplay.first_name ? (
        <div className="card">
            {isLoading ? (<h1>Loading...</h1>) : (
            <>
                <a href={`/students/${id}`}>{studentToDisplay.first_name} {studentToDisplay.last_name}</a>
                <h3>Grade {studentToDisplay.grade}</h3>
                <p> Accommodations: </p>
                {studentToDisplay.accommodations && studentToDisplay.accommodations.length > 0 ? (
                    studentToDisplay.accommodations.map(accommodation => (
                        <div key={accommodation.id}>
                            <a href={`/comments/${id}/${accommodation.id}`}>{accommodation.description}</a>
                        </div>
                    ))
                ) : (
                <div>No Accommodations</div>
                )}
                <h2>Enter the updated student info and click submit: </h2>
                <form onSubmit={formik.handleSubmit}>
                    <label htmlFor="first-name">First Name: </label>
                        <div>
                            <input 
                            type="text" 
                            placeholder="Enter first name" 
                            name="firstName"
                            id="first-name" 
                            value={formik.values.firstName} /* add touched, blur and errors */
                            onChange={formik.handleChange}/>
                        </div>
                    <label htmlFor="last-name">Last Name: </label>
                        <div>
                            <input type="text" 
                            placeholder="Enter last name" 
                            name="lastName"
                            id="last-name" 
                            value={formik.values.lastName} 
                            onChange={formik.handleChange}/>
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
            </>
            )}
        </div>
        ) : null
    )
}

export default EditStudent