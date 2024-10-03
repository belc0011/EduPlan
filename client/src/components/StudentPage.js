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
                    <h1 className="text-5xl py-6 bg-slate-200">{studentToDisplay.first_name} {studentToDisplay.last_name}</h1>
                    <div className="grid grid-cols-2 pl-40 pr-40 gap-20 py-5">
                        <button onClick={handleDelete} className="text-red-800 text-3xl bg-red-100 border-red-900 border-4">Delete student record</button>
                        <button onClick={handleEdit} className="text-blue-800 text-3xl bg-blue-100 border-4">Edit student record</button>
                    </div>
                    <h2 className="text-4xl pb-5">Accommodations: </h2>
                    { studentToDisplay ? (
                        <div className="pb-6">
                            {studentToDisplay.accommodations ? studentToDisplay.accommodations.map((accommodation) => {
                                return <div key={accommodation.id} className="py-3"><button onClick={() => handleEditClick(accommodation)} className="bg-slate-200 rounded-3xl px-20 text-2xl text-black">
                                {accommodation.description}
                              </button> 
                              </div>;
                            }) : <p>No Accommodations</p>}
                        </div>
                        ) : (
                            <p>No student data to display</p>
                            )}
                    <form onSubmit={formik.handleSubmit} className="bg-neutral-100">
                        <h2 className="italic text-xl bg-slate-100 py-5">To add an accommodation for this student, type the description into the text box and choose the appropriate category</h2>
                        <div className="py-3 text-lg">
                            <label htmlFor="new-accommodation">New Accommodation: </label>
                        </div>
                            <div className="grid grid-cols-2 px-40">
                                <div className="pb-5 pl-20">
                                    <input 
                                        type="text" 
                                        placeholder="Enter description" 
                                        className="border-4 py-2 max-w-full"
                                        name="description"
                                        id="description" 
                                        value={formik.values.description} 
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}/>
                                        {formik.touched.description && formik.errors.description ? (
                                        <p style={{ color: "red" }}>{formik.errors.description}</p>
                                        ) : null}
                                </div>
                                <div className="pb-5 pr-20">
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
                            </div>
                        <button type='submit'>SUBMIT</button>
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