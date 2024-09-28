import React from 'react'
import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import { StudentContext } from "./MyContext.js";
import { useFormik } from "formik";
import * as yup from "yup";
import AddComment from "./AddComment.js"
import EditComment from './EditComment.js';
import { Link } from 'react-router-dom';

function EditAccommodation() {
    const location = useLocation()
    const url = location.pathname
    const parts = url.split("/")
    const id = parseInt(parts[2], 10)
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { students, setStudents, studentToDisplay, setStudentToDisplay, accommodationToDisplay, setAccommodationToDisplay } = useContext(StudentContext);
    const [showAddComment, setShowAddComment] = useState(false);
    const accommodationId = accommodationToDisplay.id;

    console.log(studentToDisplay);
    console.log(accommodationToDisplay)

    const formSchema = yup.object().shape({
        description: yup
        .string()
        .matches(/^[a-zA-Z\'\- ]+$/, "Description can not contain numbers or special characters, except an apostrophe, hyphen or white space")
        .required(),
      });
    
      const formik = useFormik({
        initialValues: {
          description: "",
        },
        validationSchema: formSchema,
        onSubmit: (values, { resetForm }) => {
            console.log("inside on submit")
            fetch(`http://127.0.0.1:5555/accommodations/${accommodationId}`, {
                method: "PATCH",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(values, null, 2),
                credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            setAccommodationToDisplay(data); 
            console.log(data)
            const updatedAccommodation = data
            setStudentToDisplay(prevStudent => {
                const updatedAccommodations = prevStudent.accommodations.map(accommodation => 
                    accommodation.id === accommodationId ? updatedAccommodation : accommodation
                );
                return {
                    ...prevStudent,
                    accommodations: updatedAccommodations
                };
            })
            resetForm();
        })
        .catch(error => {
            console.error('Error updating student:', error)})
        }
    });
    function handleComment(e) {
        setShowAddComment(true)
    }

    function handleCommentClick(e) {
        console.log(accommodationToDisplay)
        console.log(accommodationToDisplay.comment.id)
        navigate(`/comment/${accommodationId}`);
    }

    function handleDeleteClick(e) {
        const isConfirmed = window.confirm('Are you sure you want to delete this accommodation?');
        if (isConfirmed) {
        fetch(`http://127.0.0.1:5555/accommodations/${accommodationId}`, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            },
            credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        const updatedAccommodations = studentToDisplay.accommodations.filter(accommodation => accommodation.id !== accommodationId);
        const updatedStudents = students.map(student => {
            if (student.id === id) {
                return {...student, accommodations: updatedAccommodations}
            }
            return student;
        })
        setStudents(updatedStudents);
        navigate(`/students/${id}`)
    })
    
    }
    else {
        console.log('User canceled delete action')
    }
}
    return (
        studentToDisplay ? (
        <div>
            <div className="card">
                {isLoading ? (<h1>Loading...</h1>) : (
                <>
                    <a href={`/students/${id}`}>{studentToDisplay.first_name} {studentToDisplay.last_name}</a>
                    <h3>Grade {studentToDisplay.grade}</h3>
                    {accommodationToDisplay ? (
                        <div>
                            <div>
                                <button onClick={handleComment}>ADD A COMMENT</button>
                            </div>
                            <div>
                                <h2>{accommodationToDisplay.description}</h2>
                                {accommodationToDisplay.comment ? 
                                (<div> 
                                    <h3>Comment:</h3>
                                    <ul>
                                        <li key={accommodationToDisplay.comment.id}>
                                            <Link 
                                                to={`/comment/${accommodationId}`} 
                                                state={{ 
                                                    accommodation: accommodationToDisplay,
                                                    student: studentToDisplay,
                                                    commentId: accommodationToDisplay.comment.id
                                                }}
                                                onClick={handleCommentClick}
                                            >
                                                {accommodationToDisplay.comment.description}
                                            </Link>
                                        </li>
                                    </ul>
                                    </div>) : null}
                                </div>
                            <div>
                                <p></p>
                            </div>
                            <h3>Edit accommodation: </h3>
                            <form onSubmit={formik.handleSubmit}>
                            <label htmlFor="description">Enter updated accommodation description: </label>
                                <div>
                                    <input 
                                    type="text" 
                                    placeholder="Enter description" 
                                    name="description"
                                    id="description" 
                                    value={formik.values.description} /* add touched, blur and errors */
                                    onChange={formik.handleChange}/>
                                </div>
                                <div>
                                <p></p>
                                <button type="submit">Submit</button>
                                </div>
                            </form>
                            <div>
                                <button onClick={handleDeleteClick}>Click Here to Delete Accommodation</button>
                            </div>
                        </div>
                    ) : (
                    <div>No Accommodations</div>
                    )}
                </>
                )}
            </div>
            <div>
                {showAddComment ? (
                    <AddComment accommodation={accommodationToDisplay} setAccommodation={setAccommodationToDisplay} student={studentToDisplay} setStudent={setStudentToDisplay} students={students} setStudents={setStudents}/>
                ) : null}
            </div>
        </div>
        ) : null
    )
}

export default EditAccommodation