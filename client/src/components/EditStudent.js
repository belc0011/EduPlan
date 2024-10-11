import React from 'react'
import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import { StudentContext } from "./MyContext.js";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link } from 'react-router-dom';

function EditStudent() {
    const location = useLocation()
    const url = location.pathname
    const parts = url.split("/")
    const id = parseInt(parts[3], 10)
    const [isLoading, setIsLoading] = useState(false);
    const { students, setStudents, studentToDisplay, setStudentToDisplay } = useContext(StudentContext);
    
    const formSchema = yup.object().shape({
        first_name: yup
        .string()
        .matches(/^[a-zA-Z\']+$/, "First name can not contain numbers or special characters, except an apostrophe"),
        last_name: yup
        .string()
        .matches(/^[a-zA-Z\-]+$/, "Last name can only contain letters and hyphens"),
      });

    const formik = useFormik({
        initialValues: {
          first_name: "",
          last_name: "",
          grade: "",
        },
        validationSchema: formSchema,
        onSubmit: (values, { resetForm }) => {
            const changes = {};

            if (values.first_name !== formik.initialValues.first_name) {
                changes.first_name = values.first_name;
            }

            if (values.last_name !== formik.initialValues.last_name) {
                changes.last_name = values.last_name;
            }

            if (values.grade !== formik.initialValues.grade) {
                changes.grade = values.grade;
            }
            
            if (Object.keys(changes).length > 0) {
            fetch(`https://eduplan.onrender.com/students/${id}`, {
                method: "PATCH",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(changes, null, 2),
                credentials: 'include'
            })
            .then(res => {
                if (res.ok) {
                    res.json().then(data => {
                        setStudentToDisplay(data);
                        setStudents(prevStudents => {
                            const studentIndex = prevStudents.findIndex(student => student.id === data.id);
                            
                            if (studentIndex !== -1) {
                                return [...prevStudents.slice(0, studentIndex), data,...prevStudents.slice(studentIndex + 1)];
        
                        }})
                    resetForm()})
                }
                else {
                    console.log("error: " + res)
                }
            })
            .catch(error => {
                console.error('Error updating student:', error)})
        }
    }
    });
    return (
        studentToDisplay.first_name ? (
        <div className="bg-slate-200">
            {isLoading ? (<h1>Loading...</h1>) : (
            <>
                <Link 
                    to={`/students/${id}`} 
                    className="text-blue-700 text-5xl font-bold"
                >
                    {studentToDisplay.first_name} {studentToDisplay.last_name}
                </Link>
                <h3 className="py-5 text-3xl italic">Current grade {studentToDisplay.grade}</h3>
                <p className="text-red-700 text-3xl py-4"> Current accommodations: </p>
                {studentToDisplay.accommodations && studentToDisplay.accommodations.length > 0 ? (
                    studentToDisplay.accommodations.map(accommodation => (
                        <div key={accommodation.id} className="py-3">
                            <Link to={`/students/${id}/${accommodation.id}`}>
                                {accommodation.description}
                            </Link>
                        </div>
                    ))
                ) : (
                <div className="text-xl italic py-4">No Accommodations</div>
                )}
                <div className="bg-slate-700">
                    <h2 className="text-white text-xl italic py-3">Enter the updated student information</h2>
                    <form onSubmit={formik.handleSubmit}>
                        <div>
                            <label htmlFor="first-name" className="text-white text-3xl pb-2 italic">To change first name: </label>
                                <input 
                                type="text" 
                                placeholder="Enter first name"
                                className="text-black text-2xl" 
                                name="first_name"
                                id="first-name" 
                                value={formik.values.first_name} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}/>
                                {formik.touched.first_name && formik.errors.first_name ? (
                                <p style={{ color: "red" }}>{formik.errors.first_name}</p>
                                ) : null}
                        </div>
                        <div className="py-3">
                            <label htmlFor="last-name" className="text-3xl text-white italic">To change last name: </label>
                                <input type="text" 
                                placeholder="Enter last name" 
                                name="last_name"
                                className="text-2xl"
                                id="last-name" 
                                value={formik.values.last_name} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}/>
                                {formik.touched.last_name && formik.errors.last_name ? (
                                <p style={{ color: "red" }}>{formik.errors.last_name}</p>
                                ) : null}
                            </div>
                        <div className="py-3">    
                            <label htmlFor="grade" className="text-white text-3xl italic">To change grade: </label>
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
                            <div className="py-3">
                                <button type="submit" className="bg-slate-200 text-2xl font-bold text-black">SUBMIT</button>
                            </div>
                    </form>
                </div>
            </>
            )}
        </div>
        ) : <p className="italic text-xl">Error loading page, please return to home page</p>
    )
}

export default EditStudent