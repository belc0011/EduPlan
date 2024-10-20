import React, { useContext } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import { StudentContext } from "./MyContext.js";

function AccommodationByCategory() {
    const { user, students, setStudentToDisplay, categories } = useContext(StudentContext);
    const location = useLocation()
    const url = location.pathname
    const parts = url.split("/")
    const categoryId = parseInt(parts[3], 10)
    const navigate = useNavigate();
    
    console.log(categoryId)
    if (!categories || categories.length === 0) {
        
        return <div>Loading categories...</div>;
    }
    
    const selectedCategory = categories.filter(category => category.id === categoryId);
    console.log(selectedCategory);

    function handleClick(studentId) {
        const student = students.find(student => student.id === studentId)
        setStudentToDisplay(student)
        navigate(`/students/${studentId}`)
    }

    return (
        user ? (
            selectedCategory[0] ? (
                <div>
                    {selectedCategory[0].accommodations.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4">
                        {selectedCategory[0].accommodations.map(accommodation => (
                            <button
                                key={accommodation.id} 
                                className="bg-slate-200 border-4 border-slate-500"
                                onClick={() => handleClick(accommodation.student.id)}
                            >
                                <h1 className="text-4xl py-3 text-black font-bold">
                                    {accommodation.student.first_name} {accommodation.student.last_name}
                                </h1>
                                <h2 className="text-2xl py-3">
                                    {accommodation.description}
                                </h2>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-2xl italic">No accommodations in this category</div>
                )}
                </div>
            ) : (<p className="text-2xl italic">Loading...if page doesn't load, please return to the home page</p>)
        ) : <Login />
    )
}

export default AccommodationByCategory