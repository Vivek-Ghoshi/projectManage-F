import React, { createContext, useContext, useState } from 'react'
 
const ProgressContext = createContext();
const ProgressProvider = ({children}) => {

  const [progress, setProgress] = useState(0);

  return (
    <ProgressContext.Provider value={{progress,setProgress}}>
      {children}
    </ProgressContext.Provider>
  )
}

export const useProgress = ()=> useContext(ProgressContext);
export default ProgressProvider
