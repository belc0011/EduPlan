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
    function handleSubmit(e) {
        e.preventDefault()
        setShowComponent(true)
    }
    
    function handleSubmit2(e) {
        e.preventDefault()
        navigate('/students')
        
    }

    function handleClick2(e) {
        navigate('/categories')
    }
    return (
        <div>
            <main>
                <h3>Click here to see a list of accommodations: </h3>
                <button onClick={handleClick}>Accommodation Search</button>
                <h3>Click here to see a list of categories: </h3>
                <button onClick={handleClick2}>Category List</button>
                <form onSubmit={handleSubmit2}>
                    <h3>Click here for a list of your students</h3>
                    <div>
                        <p></p>
                        <button type="submit">Student List</button>
                    </div>
                </form>
                <form onSubmit={handleSubmit}>
                <h3>Click here to add a student</h3>
                    <div>
                        <p></p>
                        <button type="submit">Add a student</button>
                    </div>
                </form>
                {showComponent && <AddStudent />}
            </main>
        </div>
            )
}

export default Home