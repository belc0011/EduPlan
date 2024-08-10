import React from 'react'
import { useState, useEffect } from "react";
import StudentCard from './StudentCard.js'
import AddStudent from './AddStudent.js'
import { StudentContext } from "./MyContext.js";
function Students({ students, setStudents, setError }) {
    const [showAddStudent, setShowAddStudent] = useState(false)
    
    const { students } = useContext(StudentContext);
    
    function handleClick(e) {
        setShowAddStudent(true)
    }
    return (
        <div>
            <button onClick={handleClick}>Click here to add a new student</button>
            {showAddStudent && <AddStudent setError={setError} students={students} setStudents={setStudents}/>}
            <main>
                <h1>Students</h1>
                <h3>Click on an accommodation to see comments</h3>
                <div>
                    {students.map(student => {
                        return (
                            <StudentCard
                            key={student.id}
                            id={student.id}
                            firstName={student.first_name}
                            lastName={student.last_name}
                            grade={student.grade}
                            accommodations={student.accommodations}
                            />
                        )
                    })}
                </div>
            </main>
        </div>
    )
}

export default Students