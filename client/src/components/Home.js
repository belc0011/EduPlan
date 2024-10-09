import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom'
import AddStudent from './AddStudent'

function Home() {
    const [showComponent, setShowComponent] = useState(false);
    const navigate = useNavigate()

    function handleClick(e) {
        navigate('/accommodations')
    }
    function handleAddStudent(e) {
        setShowComponent(true)
    }
    
    function handleStudentClick(e) {
        navigate('/students')
        
    }

    function handleCategoryClick(e) {
        navigate('/categories')
    }

    return (
        <div>
            <main className="bg-slate-100 py-2 px-40">
                <div className="py-2 bg-emerald-200 border-4 border-solid">
                    <h1 className="text-2xl py-2">For a searchable list of accommodations:</h1>
                    <button onClick={handleClick}>SEARCH ACCOMMODATIONS</button>
                </div>
                <div className="py-2 bg-violet-300 border-4 border-solid">
                    <h1 className="text-2xl py-2">For a list of categories:</h1>
                    <button onClick={handleCategoryClick}>CATEGORIES</button>
                </div>
                <div className="py-2 bg-slate-300 border-4 border-solid">
                    <h1 className="text-2xl py-2">For a list of students:</h1>
                    <button onClick={handleStudentClick}>STUDENTS</button>
                </div>
                <div className="py-2 bg-green-400 border-4 border-solid">
                    <h1 className="text-2xl py-2">To add a student:</h1>
                    <button onClick={handleAddStudent}>ADD STUDENT</button>
                </div>
                {showComponent && <AddStudent />}
            </main>
        </div>
            )
}

export default Home