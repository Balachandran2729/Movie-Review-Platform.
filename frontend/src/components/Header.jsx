// client/src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/authSlice';
import { FaPlusCircle } from 'react-icons/fa'; // Import the icon

const Header = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <header className="bg-blue-600 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold"><span className='text-white hover:text-blue-200 transition'>MovieReviews</span> </Link>
          
          <nav className="flex items-center space-x-6">
            <Link to="/" ><span className='text-white hover:text-blue-200 transition'>Home</span> </Link>
            <Link to="/movies" ><span className='text-white hover:text-blue-200 transition'>Movies</span> </Link>
            
            {/* Show Add Movie button only for Admins */}
            {isAuthenticated && user?.role === 'admin' && (
              <Link 
                to="/admin/movie/create" 
                className="flex items-center hover:text-blue-200 transition"
              >
                <FaPlusCircle className="mr-1 text-white" /><span className='text-white hover:text-blue-200 transition'>  Add Movie</span> 
              </Link>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="hover:text-blue-200 transition">
                 <span className='text-white hover:text-blue-200 transition'>{user?.username}</span> 
                </Link>
                <button 
                  onClick={handleLogout}
                  className=" px-4 py-2 rounded transitionn text-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-3">
                <Link to="/login" ><span className='text-white hover:text-blue-200 transition'>Login</span> </Link>
                <Link to="/register" ><span className="text-white hover:text-blue-200 transition">Register</span> </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;