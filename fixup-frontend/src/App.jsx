import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import BookForm from './pages/client/BookRequestForm'
function App() {
  const [count, setCount] = useState(0)

  return (
   <>
   <Routes>
   <Route path="/bookform"              element={<BookForm />} />
   </Routes></>
  )
}

export default App
