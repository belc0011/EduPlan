import React from 'react'
import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import { StudentContext } from "./MyContext.js";
import { useFormik } from "formik";
import * as yup from "yup";

function EditAccommodation() {
    const location = useLocation()
    const url = location.pathname
    const parts = url.split("/")
    const id = parseInt(parts[2], 10)
    const [studentToDisplay, setStudentToDisplay] = useState({})
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { students, setStudents } = useContext(StudentContext);
    // Need to store the student to display in a state variable "studentToDisplay" and use that state variable to display data, not make a fetch request
    useEffect(() => {
        const student = students.find(student => student.id === id);
        setStudentToDisplay(student);
    }, [students, id]);
    console.log(studentToDisplay.first_name);
    console.log(id)

    function handleClick(e) {
        fetch()
    }

    return (
        studentToDisplay.first_name ? (
        <div className="card">
            {isLoading ? (<h1>Loading...</h1>) : (
            <>
                <a href={`/students/${id}`}>{studentToDisplay.first_name} {studentToDisplay.last_name}</a>
                <h3>Grade {studentToDisplay.grade}</h3>
                <h4> Accommodations: </h4>
                {studentToDisplay.accommodations && studentToDisplay.accommodations.length > 0 ? (
                    studentToDisplay.accommodations.map(accommodation => (
                        <div key={accommodation.id}>
                            <li>{accommodation.description}</li>
                            <button onClick={handleEditClick}>Edit</button>
                            <button onClick={handleDeleteClick}>Delete</button>
                        </div>
                    ))
                ) : (
                <div>No Accommodations</div>
                )}
                <h2>Click on an accommodation to delete </h2>
            </>
            )}
        </div>
        ) : null
    )
}

export default EditAccommodation