import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import { useFormik } from "formik";
import { StudentContext } from "./MyContext.js";
import EditAccommodation from "./EditAccommodation.js";

function StudentPage({ }) {
    const location = useLocation()
    const url = location.pathname
    const parts = url.split("/")
    const id = parseInt(parts[2])
    const navigate = useNavigate()
    const { students, setStudents, categories, studentToDisplay, setStudentToDisplay, accommodationToDisplay, setAccommodationToDisplay } = useContext(StudentContext);
    const student_id = id
    const [showEditAccommodation, setShowEditAccommodation] = useState(false);
    
    useEffect(() => {
        if (students) {
            const student = students.find(student => student.id === id);
        setStudentToDisplay(student);
        }
    }, [students]);

    const formik = useFormik({
        initialValues: {
          description: "",
          category_id: "",
          student_id: id
        },
        onSubmit: (values, { resetForm }) => {
            fetch("http://127.0.0.1:5555/accommodations", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values, null, 2),
              credentials: 'include'
          })
        .then(res => res.json())
        .then(data => {
            setStudentToDisplay(prevState => ({
                ...prevState,
                accommodations: [...prevState.accommodations, data]
            }));
            resetForm();
        });
        }
    })

    function handleDelete(e) {
        const userConfirmed = window.confirm("Are you sure you want to delete this student record?");
        if (userConfirmed) {
            fetch(`http://127.0.0.1:5555/students/${id}`, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                },
                credentials: 'include'
            })
            .then(res => res.json())
            .then(data => {
                setStudents(prevState => prevState.filter(student => student.id !== id));
                setStudentToDisplay({});
                navigate("/students");
            });
        }
    }

    function handleEdit(e) {
        navigate(`/students/edit_student/${id}`)
    }

    function handleEditClick(accommodation) {
        setShowEditAccommodation(true);
        setAccommodationToDisplay(accommodation);
        console.log(accommodationToDisplay);
    }

    return (
        <div>
            {!showEditAccommodation ? (
            <div>
                {studentToDisplay ? (
                <>
                    <h1>{studentToDisplay.first_name} {studentToDisplay.last_name}</h1>
                    <button onClick={handleDelete}>Delete student record</button>
                    <button onClick={handleEdit}>Edit student record</button>
                    <h2>Accommodations: </h2>
                    { studentToDisplay ? (
                        <div>
                            {studentToDisplay.accommodations ? studentToDisplay.accommodations.map((accommodation) => {
                                return <div key={accommodation.id}><button onClick={() => handleEditClick(accommodation)}>
                                {accommodation.description}
                              </button> 
                              </div>;
                            }) : <p>No Accommodations</p>}
                        </div>
                        ) : (
                            <p>No student data to display</p>
                            )}
                    <form onSubmit={formik.handleSubmit}>
                        <h2>To add an accommodation for this student, type the description into the text box, choose the appropriate category for the accommodation, then click Submit </h2>
                        <label htmlFor="new-accommodation">New Accommodation: </label>
                                <div>
                                    <input 
                                        type="text" 
                                        placeholder="Enter description" 
                                        name="description"
                                        id="description" 
                                        value={formik.values.description} 
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}/>
                                        {formik.touched.description && formik.errors.description ? (
                                        <p style={{ color: "red" }}>{formik.errors.description}</p>
                                        ) : null}
                                </div>
                                <h1>   </h1> 
                                <div>
                                    <select type="dropdown" 
                                    id="category_id" 
                                    name="category_id"
                                    value={formik.values.category_id} 
                                    onChange={formik.handleChange}>
                                        <option value="" disabled>
                                            Select one
                                        </option>
                                        {categories.map(category => {
                                        return <option key={category.id} value={category.id}>
                                        {category.description}
                                    </option>
                                        })}
                                    </select>
                                </div>
                                <h1>  </h1>
                                <h1>  </h1>
                        <button type='submit'>Submit</button>
                    </form>
                    <br></br>
                    <br></br>
                    </>
                ) : ( 
                    <p>Loading...</p>
                    )}
            </div>
        ) : (
            <EditAccommodation student={studentToDisplay} accommodation={accommodationToDisplay} setStudent={setStudentToDisplay} setAccommodation={setAccommodationToDisplay}/>
        )}
    </div>
    )
}

export default StudentPage