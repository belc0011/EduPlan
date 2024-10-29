import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import { useFormik } from "formik";
import * as yup from "yup";
import { StudentContext } from "./MyContext.js";
import EditAccommodation from "./EditAccommodation.js";

function StudentPage({ }) {
    const location = useLocation()
    const url = location.pathname
    const parts = url.split("/")
    const id = parseInt(parts[2])
    const navigate = useNavigate()
    const { students, setStudents, categories, studentToDisplay, setStudentToDisplay, accommodationToDisplay, setAccommodationToDisplay } = useContext(StudentContext);
    const [showEditAccommodation, setShowEditAccommodation] = useState(false);
    
    useEffect(() => {
        if (students) {
            const student = students.find(student => student.id === id);
        setStudentToDisplay(student);
        }
    }, [students]);

    const formSchema = yup.object().shape({
        description: yup
        .string()
        .matches(/^[a-zA-Z0-9'\/&,\- ]+$/, "Description can not contain special characters, except an apostrophe, hyphen, forward slash, ampersand, or comma")
        .required(),
        category_id: yup.number().required("Category is required"),
      });

    const formik = useFormik({
        initialValues: {
          description: "",
          category_id: "",
          student_id: id
        },
        validationSchema: formSchema,
        onSubmit: (values, { resetForm }) => {
            fetch("https://eduplan.onrender.com/accommodations", {
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
            setStudents(prevStudents => prevStudents.map(student => 
                student.id === studentToDisplay.id 
                    ? {
                        ...student,
                        accommodations: [...student.accommodations, data]
                      }
                    : student
            ));
            resetForm();
        })
        .catch(err => console.error);
        }
    })

    function handleDelete(e) {
        const userConfirmed = window.confirm("Are you sure you want to delete this student record?");
        if (userConfirmed) {
            fetch(`https://eduplan.onrender.com/students/${id}`, {
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
            })
            .catch(err => console.error);
        }
    }

    function handleEdit(e) {
        navigate(`/students/edit_student/${id}`)
    }

    function handleEditClick(accommodation) {
        setShowEditAccommodation(true);
        setAccommodationToDisplay(accommodation);
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
                    <form onSubmit={formik.handleSubmit} className="bg-slate-700">
                        <h2 className="italic text-4xl text-white py-5">ADD AN ACCOMMODATION:</h2>
                            <div className="">
                                <div className="pb-5 pl-20">
                                <label htmlFor="new-accommodation" className="text-2xl text-white pr-5">New accommodation description:</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter description" 
                                        className="border-2 border-blue-400 text-black text-xl py-2 w-1/2"
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
                                    <label htmlFor="new-category" className="text-2xl text-white pr-5">Category:</label>
                                        <select type="dropdown" 
                                        id="category_id" 
                                        name="category_id"
                                        className="border-blue-400"
                                        value={formik.values.category_id} 
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}>
                                            <option value="" disabled>
                                                Select one
                                            </option>
                                            {categories.length > 0 ? (categories.map(category => {
                                            return <option key={category.id} value={category.id}>
                                            {category.description}
                                            </option>})) : null
                                            }
                                        </select>
                                        {formik.touched.category_id && formik.errors.category_id ? (
                                            <p style={{ color: "red" }}>{formik.errors.category_id}</p>
                                            ) : null 
                                        }
                                </div>
                            </div>
                        <div className="py-4">
                            <button type='submit' className="text-2xl bg-slate-200 text-blue-700">SUBMIT</button>
                        </div>
                    </form>
                    <br></br>
                    <br></br>
                    </>
                ) : ( 
                    <p>Loading...</p>
                    )}
            </div>
        ) : (
            <EditAccommodation student={studentToDisplay} accommodation={accommodationToDisplay} setStudent={setStudentToDisplay} setAccommodation={setAccommodationToDisplay} setShowEditAccommodation={setShowEditAccommodation}/>
        )}
    </div>
    )
}

export default StudentPage