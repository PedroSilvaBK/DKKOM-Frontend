import { Route, Routes } from 'react-router'
import './App.css'
import LogIn from './pages/LogIn'
import { BrowserRouter } from 'react-router-dom'
import Index from './pages/Index'
import AuthCallback from './pages/AuthCallback'
import PrivateRoute from './components/PrivateRoute'
import InvitePage from './pages/InvitePage'
import VoicePage from './pages/VoicePage'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <PrivateRoute>
              <Index />
            </PrivateRoute>
          } />
          <Route path='/:cave_id' element={
            <PrivateRoute>
              <Index />
            </PrivateRoute>
          } />
          <Route path='/login' element={<LogIn />} />
          <Route path='/auth/callback' element={<AuthCallback />} />
          <Route path='/invite/:invite_id' element={<InvitePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
