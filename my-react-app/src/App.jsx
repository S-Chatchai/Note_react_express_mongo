import { useState, useEffect } from 'react'
import './App.css'

function App() {

  const [text, setText] = useState('')
  const [notes, setNotes] = useState([])

  const API_URL = "https://your-backend-name.onrender.com/api/notes"; 
  // You will get this URL after Step 3

  // Load notes from MongoDB on startup
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setNotes(data));
  }, []);

  const addNote = async()=>{
    if (text.trim() !== ''){
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text })
      });
      const savedNote = await response.json();  
      setNotes([...notes, savedNote])
      setText('')
    }
  }

  // Function to delete a single note
  const deleteNote = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    // Remove from UI
    setNotes(notes.filter(note => note._id !== id));
  }

  // Function to clear all notes
  const clearNotes = async () => {
    await fetch(API_URL, { method: 'DELETE' });
    // Clear UI
    setNotes([]);
  }



  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Note App</h1>
      <div>
        <input 
        type="text" 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="Type something..." 
        />
        <button onClick={addNote}>
          Add
        </button>
        <button onClick={clearNotes}>
          ClearAll
        </button>
        <p>You typed: {text}</p> 
        
        <ul style={{ listStyleType: 'none', padding: 0, marginTop: '20px' }}>
          {notes.map((note) => (
            <li key={note._id}>• {note.content}
              <button onClick={() => deleteNote(note._id)}>
              X
              </button>
            </li>  
          ))}

        </ul>
      </div>
    </div>
  )
}

export default App