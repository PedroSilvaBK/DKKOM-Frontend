import { Route, Routes } from 'react-router'
import './App.css'
import LogIn from './pages/LogIn'
import { BrowserRouter } from 'react-router-dom'
import Index from './pages/Index'
import AuthCallback from './pages/AuthCallback'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Index />} />
          <Route path='/login' element={<LogIn />} />
          <Route path='/auth/callback' element={<AuthCallback />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
