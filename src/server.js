
import { useState, useEffect } from 'react';

function App() {
  const [professor, setProfessor] = useState(null);

  useEffect(() => {
    // Make a GET request to the Flask API to retrieve the  details
    fetch('http://localhost:3001/name')
      .then(response => response.json())
      .then(data => setProfessor(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      {professor ? (
        <div>
          <h1>{professor.name}</h1>
          <p>Age: {professor.age}</p>
          <p>Department: {professor.department}</p>
        </div>
      ) : (
        <p>Loading professor details...</p>
      )}
    </div>
  );
}

export default App;
