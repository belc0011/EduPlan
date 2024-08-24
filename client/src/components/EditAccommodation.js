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
    const accommodationId = parseInt(parts[3], 10)
    const [studentToDisplay, setStudentToDisplay] = useState({})
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { students, setStudents } = useContext(StudentContext);
    const [accommodationToDisplay, setAccommodationToDisplay] = useState({})
    // Need to store the student to display in a state variable "studentToDisplay" and use that state variable to display data, not make a fetch request
    useEffect(() => {
        const student = students.find(student => student.id === id);
        setStudentToDisplay(student);
        setAccommodationToDisplay(student.accommodations.find(accommodation => accommodation.id===accommodationId))
    }, [students, id]);
    console.log(studentToDisplay);
    console.log(accommodationToDisplay)

    const formSchema = yup.object().shape({
        description: yup
        .string()
        .matches(/^[a-zA-Z\'\- ]+$/, "Description can not contain numbers or special characters, except an apostrophe, hyphen or white space")
        .required(),
      });
    function handleEditClick(e) {
        fetch(`http://127.0.0.1:5555/accommodations/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values, null, 2),
            credentials: 'include'
        })
        .then(res => {
            if (res.ok) {
                res.json().then(data => {
                    setStudentToDisplay(data);
                    setStudents(prevAccommodations => {
                        const accommodationIndex = prevAccommodations.findIndex(accommodation => accommodation.id === data.id);
                        
                        if (accommodationIndex !== -1) {
                            return [...prevAccommodations.slice(0, accommodationIndex), data,...prevAccommodations.slice(accommodationIndex + 1)];
    
                    }})
                    navigate('/')
                    resetForm()})
            }
            else {
                console.log("error: " + res)
            }
        })
        .catch(error => {
            console.error('Error updating student:', error)})
    }

    function handleDeleteClick(e) {
        fetch()
    }
    
    return (
        studentToDisplay ? (
        <div className="card">
            {isLoading ? (<h1>Loading...</h1>) : (
            <>
                <a href={`/students/${id}`}>{studentToDisplay.first_name} {studentToDisplay.last_name}</a>
                <h3>Grade {studentToDisplay.grade}</h3>
                {accommodationToDisplay ? (
                    <div>
                        <h2>{accommodationToDisplay.description}</h2>
                        <button onClick={handleEditClick}>Edit</button>
                        <button onClick={handleDeleteClick}>Delete</button>
                    </div>
                ) : (
                <div>No Accommodations</div>
                )}
            </>
            )}
        </div>
        ) : null
    )
}

export default EditAccommodation