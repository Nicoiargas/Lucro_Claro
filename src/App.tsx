import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProjectForm from './pages/ProjectForm'
import CollaboratorForm from './pages/CollaboratorForm'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects/new" element={<ProjectForm />} />
        <Route path="/projects/edit/:id" element={<ProjectForm />} />
        <Route path="/collaborators/new" element={<CollaboratorForm />} />
        <Route path="/collaborators/edit/:id" element={<CollaboratorForm />} />
      </Routes>
    </Router>
  )
}

export default App

