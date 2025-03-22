import PropTypes from 'prop-types';
import React, { useState } from 'react';

export const UserContext = React.createContext(); 

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
UserProvider.propTypes = {
    children: PropTypes.array.isRequired
}