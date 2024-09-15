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
    const accommodationId = parseInt(parts[3], 10)
    const [studentToDisplay, setStudentToDisplay] = useState({})
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { students, setStudents } = useContext(StudentContext);
    const [accommodationToDisplay, setAccommodationToDisplay] = useState({})
    const [showAddComment, setShowAddComment] = useState(false);
    // Need to store the student to display in a state variable "studentToDisplay" and use that state variable to display data, not make a fetch request
    useEffect(() => {
        if (students) {
            const student = students.find(student => student.id === id);
            setStudentToDisplay(student || {});
            setAccommodationToDisplay(student ? student.accommodations.find(accommodation => accommodation.id === accommodationId) : {});
        }
    }, [students, id, accommodationId]);
    
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
            setStudentToDisplay(prevStudent =>{
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
        navigate(`/comment/${accommodationId}`, { state: { 
            accommodation: accommodationToDisplay,
            student: studentToDisplay 
        } });
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
                                {accommodationToDisplay.comment ? 
                                <div>
                                    <h2>{accommodationToDisplay.description}</h2>
                                    <h3>Comments:</h3>
                                    <ul>
                                        {accommodationToDisplay.comment.map(comment => (
                                            <li key={comment.id}>
                                                <Link 
                                                    to={`/comment/${accommodationId}`} 
                                                    state={{ 
                                                        accommodation: accommodationToDisplay,
                                                        student: studentToDisplay,
                                                        commentId: comment.id 
                                                    }} // Pass state with Link
                                                    onClick={handleCommentClick}
                                                >
                                                    {comment.description}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div> 
                                : null}
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
                    <AddComment accommodation={accommodationToDisplay} setAccommodation={setAccommodationToDisplay} student={studentToDisplay} setStudent={setStudentToDisplay}/>
                ) : null}
            </div>
        </div>
        ) : null
    )
}

export default EditAccommodation