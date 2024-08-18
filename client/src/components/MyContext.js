import React from 'react';
import { useState, useEffect } from'react';

const StudentContext = React.createContext()

function StudentProvider({children}) {
    const [students, setStudents] = useState([]);
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
      .then(data => setStudents(data))
      .catch(error => console.log(error));
  }, []);
    return <StudentContext.Provider value={{students, setStudents}}>{children}</StudentContext.Provider>
}

export {StudentContext, StudentProvider}