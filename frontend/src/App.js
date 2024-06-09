import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/Login/Login';
import Footer from './components/Footer/Footer';
import Auth from './components/Auth/Auth';


function App() {
  return (
    <Router>
      <div className='page-containter'>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/auth-page' element={<Auth />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
