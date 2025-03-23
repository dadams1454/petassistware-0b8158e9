
import React from 'react';
import { Link } from 'react-router-dom';

const NavbarLogo: React.FC = () => {
  return (
    <Link to="/" className="flex-shrink-0 font-bold text-xl">
      Bear Paw Kennels
    </Link>
  );
};

export default NavbarLogo;
