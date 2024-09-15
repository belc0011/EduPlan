import React from 'react'
import { StudentContext } from "./MyContext.js";
import { useState, useEffect, useContext } from 'react';
import AddStudent from './AddStudent';
import StudentCard from './StudentCard';

function Students() {
    const [showAddStudent, setShowAddStudent] = useState(false);
    const [loading, setLoading] = useState(true);  // Loading state
    const [error, setError] = useState(false); // Error state
    const { students } = useContext(StudentContext);

    useEffect(() => {
        console.log("Students value:", students);
        if (students && students.length > 0) {
            setLoading(false);  // Data is loaded
        } else if (students === null || students === undefined) {
            setError("Failed to load student data");
        }
    }, [students, error]);

    function handleClick(e) {
        setShowAddStudent(true);
    }

    return (
        <div>
            <button onClick={handleClick}>Click here to add a new student</button>
            {showAddStudent && <AddStudent setError={setError} />}
            <main>
                <h1>Students</h1>
                <h3>Click on an accommodation to see comments</h3>
                <div>
                    {loading ? (
                        <h1>Loading student data...</h1>  // Loading state
                    ) : students.length > 0 ? (
                        students.map(student => (
                            <StudentCard
                                key={student.id}
                                id={student.id}
                                firstName={student.first_name}
                                lastName={student.last_name}
                                grade={student.grade}
                                accommodations={student.accommodations}
                            />
                        ))
                    ) : (
                        <h1>No student data to display</h1>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Students;
