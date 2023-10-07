import React, { createContext, useContext, useState } from "react";

const StateContext = createContext();

const initalState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

//Context Provider là để lấy state trong tất cả các component
export const ContextProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState(true);
  return (
    // Với các value mà chúng ta pass qua cái hook này thì
    // sẽ được pass qua tất cả các component khác
    // Và với các value đó bên dưới chúng sẽ có các children
    // VD: áp dụng cho SideBar open hay close
    <StateContext.Provider value={{ activeMenu: activeMenu, setActiveMenu }}>
      {children}
    </StateContext.Provider>
  );    
};
//           dataFromContext         byUsingContext
export const useStateContext = () => useContext(StateContext);
//                                              bySpecifieWhichOne
