import React from 'react';
import { useState, useEffect, useMemo } from'react';

const StudentContext = React.createContext()

function StudentProvider({children}) {
  const [students, setStudents] = useState(null);
  
    const [categories, setCategories] = useState([]);
    const [studentToDisplay, setStudentToDisplay] = useState({});
    
    const [accommodationToDisplay, setAccommodationToDisplay] = useState({});

  useEffect(() => {
    console.log("useEffect firing")
    fetch("http://127.0.0.1:5555/students", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('No students found');
          } else {
            throw new Error('Something went wrong');
          }
        }
        return response.json();
      })
      .then(data => {
        setStudents(data);
      console.log(data)
  })
      .catch(error => console.log(error));
  }, []);
  
  useEffect(() => {
    fetch("http://127.0.0.1:5555/categories", {
        method: "GET",
        credentials: 'include'
    })
   .then(res => res.json())
   .then(data => {
      setCategories(data.categories)
      console.log(data)
      console.log(data.categories)})
   .catch(error => console.error('Error:', error));
  }, [])

  const contextValue = useMemo(() => ({
    students,
    setStudents,
    categories,
    setCategories,
    studentToDisplay,
    setStudentToDisplay,
    accommodationToDisplay,
    setAccommodationToDisplay
  }), [students, categories, studentToDisplay, accommodationToDisplay]);
  

  return <StudentContext.Provider value={contextValue}>{children}</StudentContext.Provider>
}

export {StudentContext, StudentProvider}