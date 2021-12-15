import React from "react";

export const UserContext = React.createContext();

export const UserProvider = (props) => {
  const [userParams, setUserParams] = React.useState({
    city: "",
    genre: "",
  });
  return (
    <UserContext.Provider value={{ setUserParams, userParams }}>
      {props.children}
    </UserContext.Provider>
  );
};
