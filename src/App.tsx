import { Route, Routes } from 'react-router'
import './App.css'
import LogIn from './pages/LogIn'
import Register from './pages/Register'
import { BrowserRouter } from 'react-router-dom'
import Index from './pages'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Index />} />
          <Route path='/login' element={<LogIn />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
