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
    const { students, setStudents, studentToDisplay, setStudentToDisplay, accommodationToDisplay, setAccommodationToDisplay, categories, setCategories } = useContext(StudentContext);
    const [showAddComment, setShowAddComment] = useState(false);
    const accommodationId = accommodationToDisplay.id;

    console.log(studentToDisplay);
    console.log(accommodationToDisplay)

    const formSchema = yup.object().shape({
        description: yup
        .string()
        .matches(/^[a-zA-Z0-9\'\-\/ ]+$/, "Description can not contain special characters, except an apostrophe, hyphen, forward slash, or white space")
      });
    
      const formik = useFormik({
        initialValues: {
          description: "",
          category_id: "",
        },
        validationSchema: formSchema,
        onSubmit: (values, { resetForm }) => {
            const changes = {};

            if (values.description !== formik.initialValues.description) {
                changes.description = values.description;
            }

            if (values.category_id !== formik.initialValues.category_id) {
                changes.category_id = values.category_id;
            }

            if (Object.keys(changes).length > 0) {
                fetch(`http://127.0.0.1:5555/accommodations/${accommodationId}`, {
                    method: "PATCH",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify(changes, null, 2),
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
        }
    });
    function handleAddComment(e) {
        setShowAddComment(prevState => !prevState)
    }

    function handleCommentClick(e) {
        console.log(accommodationToDisplay)
        console.log(accommodationToDisplay.comment.id)
        navigate(`/comment/${accommodationId}`);
    }

    function handleEditComment(e) {
        navigate(`/comment/${accommodationId}`)
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
        setStudentToDisplay(prevState => {
            return {
               ...prevState,
                accommodations: updatedAccommodations
            };
        })
        if (updatedAccommodations.length === 0) {
            navigate("/students");
        }
        else {
            const firstAccommodation = studentToDisplay.accommodations[0];
            setAccommodationToDisplay(firstAccommodation)
        }
    })
    
    }
    else {
        console.log('User canceled delete action')
    }
}
    return (
        studentToDisplay ? (
        <div>
            <div className="flex justify-end pr-5 py-3">
                <button onClick={handleDeleteClick} className="py-9 text-3xl border-4 border-red-900 text-red-700">Click Here to Delete Accommodation</button>
            </div>
            <div className="bg-slate-200">
                {isLoading ? (<h1>Loading...</h1>) : (
                <>
                    <a href={`/students/${id}`} className="text-4xl italic font-bold text-red-700 flex justify-start pl-5 bg-slate-100">{studentToDisplay.first_name} {studentToDisplay.last_name}</a>
                    <h3 className="pt-2 text-lg flex justify-start pl-20 italic text-red-700 font-bold bg-slate-100">Grade {studentToDisplay.grade}</h3>
                    <div className="grid grid-cols-3 space-x-1">
                        <div className="border-2 border-slate-500 py-4 flex flex-col h-full">
                            <h1 className="text-4xl text-blue-800 font-bold py-5">Accommodation Description</h1>
                            <h2 className="text-4xl font-sans py-4">{accommodationToDisplay.description}</h2>
                        </div>
                        <div className="border-2 border-slate-500 py-4 flex flex-col h-full px-1">
                            <h3 className="text-4xl text-blue-800 font-bold py-5">Accommodation Category</h3>
                            <h3 className="italic text-4xl py-4">{accommodationToDisplay.category.description}</h3>
                        </div>
                        <div className="border-2 border-slate-500 py-4 flex flex-col h-full justify-between">
                            <h1 className="text-4xl text-blue-800 font-bold py-5">Comment</h1>
                            {accommodationToDisplay.comment ? 
                            (<>
                                <div className="flex-grow"></div>
                                <ul className="mb-3">
                                    <li key={accommodationToDisplay.comment.id}>
                                        <Link 
                                            to={`/comment/${accommodationId}`} 
                                            state={{ 
                                                accommodation: accommodationToDisplay,
                                                student: studentToDisplay,
                                                commentId: accommodationToDisplay.comment.id
                                            }}
                                            onClick={handleCommentClick}
                                            className="text-blue-700 text-4xl italic pb-3"
                                        >
                                            {accommodationToDisplay.comment.description}
                                        </Link>
                                    </li>
                                </ul>
                            </>) : <p className="italic text-2xl pb-4">No comment to display</p>}
                        </div>
                    </div>
                    {accommodationToDisplay ? (
                        <div>
                            {!accommodationToDisplay.comment ? (
                                !showAddComment ? (
                                    <>
                                        <div className="py-2">
                                            <button onClick={handleAddComment}>ADD A COMMENT</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <button onClick={handleAddComment}>HIDE ADD COMMENT</button>
                                        </div>
                                    </>
                                    )
                                ) : (
                                        <div className="py-2">
                                            <button onClick={handleEditComment}>EDIT/DELETE COMMENT</button>
                                        </div>
                                )}
                            <div>
                                {showAddComment ? (
                                    <AddComment accommodation={accommodationToDisplay} setAccommodation={setAccommodationToDisplay} student={studentToDisplay} setStudent={setStudentToDisplay} students={students} setStudents={setStudents}/>
                                ) : null}
                            </div>
                            <div className="border-blue-700 border-4 bg-white">
                                <h3 className="text-3xl text-mono py-3">Edit accommodation: </h3>
                                <form onSubmit={formik.handleSubmit}>
                                <label htmlFor="description">Adjust the accommodation description as necessary: </label>
                                    <div>
                                        <input 
                                        type="text" 
                                        placeholder="Enter description"
                                        className="border-4 py-2 px-4 w-96"  
                                        name="description"
                                        id="description" 
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}/>
                                        {formik.touched.description && formik.errors.description ? (
                                        <p style={{ color: "red" }}>{formik.errors.description}</p>
                                        ) : null}
                                    </div>
                                    <div>
                                        <div className="py-2">
                                            <label htmlFor="category" className="text-xl">Choose an updated accommodation category: </label>
                                            <select type="dropdown" 
                                            id="category_id" 
                                            name="category_id"
                                            className="text-xl border-slate-400 border-2"
                                            value={formik.values.category_id} 
                                            onChange={formik.handleChange}>
                                                <option value="">
                                                    Select one
                                                </option>
                                                {categories.map(category => {
                                                return <option key={category.id} value={category.id}>
                                                {category.description}
                                            </option>
                                                })}
                                            </select>
                                        </div>
                                        <button type="submit" className="text-xl">Submit Edit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : (
                    <div>No Accommodations</div>
                    )}
                </>
                )}
            </div>
        </div>
        ) : null
    )
}

export default EditAccommodation