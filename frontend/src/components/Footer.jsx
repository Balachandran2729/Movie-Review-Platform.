import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">MovieReviews</h3>
            <p className="text-gray-300">Your ultimate destination for movie reviews and ratings.</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition">Home</a></li>
              <li><a href="/movies" className="text-gray-300 hover:text-white transition">Movies</a></li>
              <li><a href="/profile" className="text-gray-300 hover:text-white transition">Profile</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-gray-300">support@moviereviews.com</p>
            <p className="text-gray-300">+1 (555) 123-4567</p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2025 MovieReviews. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;