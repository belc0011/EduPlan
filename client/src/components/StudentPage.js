import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import { useFormik } from "formik";
import { StudentContext } from "./MyContext.js";
import Categories from "./Categories.js";

function StudentPage({ }) {
    const location = useLocation()
    const url = location.pathname
    const parts = url.split("/")
    const id = parseInt(parts[2])
    const [studentToDisplay, setStudentToDisplay] = useState({})
    const [studentData, setStudentData] = useState(false)
    const navigate = useNavigate()
    const { students, setStudents, categories } = useContext(StudentContext);
    const student_id = id
    
    useEffect(() => {
        const student = students.find(student => student.id === id);
        setStudentToDisplay(student);
        console.log(studentToDisplay.accommodations)
    }, [students, id]);

    const formik = useFormik({
        initialValues: {
          description: "",
          category_id: "",
          student_id: id
        },
        onSubmit: (values, { resetForm }) => {
            console.log(values + id)
            fetch("http://127.0.0.1:5555/accommodations", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values, null, 2),
              credentials: 'include'
          })
        .then(res => res.json())
        .then(data => {setStudentToDisplay(data)
        resetForm() 
        })
        }
    })

    function handleDelete(e) {
        navigate(`/delete/${id}`)
    }

    function handleEdit(e) {
        navigate(`/students/edit_student/${id}`)
    }
    return (
        <div>
            {studentToDisplay ? (
            <>
                <h1>{studentToDisplay.first_name} {studentToDisplay.last_name}</h1>
                <h3>To delete this student's record, click here:</h3>
                <button onClick={handleDelete}>Click here to delete</button>
                <h3>To edit this student's record, click here:</h3>
                <button onClick={handleEdit}>Click here to edit</button>
                <h2>Accommodations: </h2>
                { studentToDisplay ? (
                    <div>
                        {studentToDisplay.accommodations ? studentToDisplay.accommodations.map((accommodation) => {
                            return <div key={accommodation.id}><a href={`/students/${id}/${accommodation.id}`}>{accommodation.description}</a> </div>;
                        }) : <p>No Accommodations</p>}
                    </div>
                    ) : (
                        <p>No student data to display</p>
                        )}
                    <div>
                        { studentToDisplay.classes && studentToDisplay.classes.length > 0 ? (
                            <div>
                                <h2>Classes:</h2>
                                {studentToDisplay.classes.map((classItem) => {
                                    return <h3 key={classItem.name}>{classItem.name}</h3>;
                                })}
                            </div>
                        ) : null}
                    </div>
                <form onSubmit={formik.handleSubmit}>
                    <h2>To add an accommodation for this student, select the accommodation from the dropdown and click Submit </h2>
                    <label htmlFor="new-accommodation">Accommodations</label>
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
                                id="category" 
                                name="category"
                                value={formik.values.category_id} 
                                onChange={formik.handleChange}>
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
    )
}

export default StudentPage