import React from 'react';
import { useState, useEffect, useMemo } from'react';

const StudentContext = React.createContext()

function StudentProvider({children, user}) {
  const [students, setStudents] = useState([]);
  
    const [categories, setCategories] = useState([]);
    const [studentToDisplay, setStudentToDisplay] = useState({});
    const [accommodationToDisplay, setAccommodationToDisplay] = useState({});
    const [categoryId, setCategoryId] = useState(null);

  useEffect(() => {
    fetch("https://eduplan.onrender.com/students", {
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
  })
      .catch(error => console.log(error));
  }, [user]);
  
  useEffect(() => {
    fetch("https://eduplan.onrender.com/categories", {
        method: "GET",
        credentials: 'include'
    })
   .then(res => {
      if (res.ok) {
        res.json().then(data => {
          setCategories(data.categories)})
        }
      else {
        console.log("error: " + res)
      }
  })
   .catch(error => console.error('Error:', error));
  }, [])

  console.log(students)

  const contextValue = useMemo(() => ({
    students,
    setStudents,
    categories,
    setCategories,
    studentToDisplay,
    setStudentToDisplay,
    accommodationToDisplay,
    setAccommodationToDisplay,
  }), [students, categories, studentToDisplay, accommodationToDisplay]);
  
  return <StudentContext.Provider value={contextValue}>{children}</StudentContext.Provider>
}

export {StudentContext, StudentProvider}