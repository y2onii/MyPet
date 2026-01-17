import { useState } from 'react'
import Header from './components/Header.jsx';
import PetDetail from './pages/PetDetail'
import PetRegistration from './pages/PetRegistration'
import PetList from './pages/PetList'
import Survey from './pages/Survey'
import Main from './pages/Main'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { Routes , Route } from 'react-router-dom'
import Footer from './components/Footer.jsx';
import { PetProvider } from './contexts/PetContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import axios from 'axios';
// import './App.css'

function App() {
  return (
    <AuthProvider>
      <PetProvider>
        <div className='App'>
          <Header />
          <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/main' element={<Main />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/survey' element={<Survey />} />
            <Route path='/pet-list' element={<PetList />} />
            <Route path='/pet-detail' element={<PetDetail />} />
            <Route path='/pet-registration' element={<PetRegistration />} />
            <Route path='/registration' element={<PetRegistration />} />
          </Routes>
          <Footer />
        </div>
      </PetProvider>
    </AuthProvider>
  )
}

export default App
