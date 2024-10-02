import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom'
import AddStudent from './AddStudent'
import { StudentContext } from "./MyContext.js";

function Home() {
    const [showComponent, setShowComponent] = useState(false);
    const navigate = useNavigate()
    const { students, setStudents, categories } = useContext(StudentContext);

    function handleClick(e) {
        navigate('/accommodations')
    }
    function handleAddStudent(e) {
        e.preventDefault()
        setShowComponent(true)
    }
    
    function handleStudentClick(e) {
        e.preventDefault()
        navigate('/students')
        
    }

    function handleCategoryClick(e) {
        navigate('/categories')
    }

    return (
        <div>
            <main className="bg-amber-100 py-2 px-40">
                <div className="py-2 bg-emerald-200 border-4 border-solid">
                    <h1 className="text-2xl py-2">For a list of accommodations:</h1>
                    <button onClick={handleClick}>Accommodation Search</button>
                </div>
                <div className="py-2 bg-violet-300 border-4 border-solid">
                    <h1 className="text-2xl py-2">For a list of categories:</h1>
                    <button onClick={handleCategoryClick}>Category List</button>
                </div>
                <div className="py-2 bg-orange-300 border-4 border-solid">
                    <h1 className="text-2xl py-2">For a list of students:</h1>
                    <button onClick={handleStudentClick}>Student List</button>
                </div>
                <div className="py-2 bg-green-400 border-4 border-solid">
                    <h1 className="text-2xl py-2">To add a student:</h1>
                    <button onClick={handleAddStudent}>Add a student</button>
                </div>
                {showComponent && <AddStudent />}
            </main>
        </div>
            )
}

export default Home