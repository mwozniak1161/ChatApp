import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import { Socket, io } from "socket.io-client";

const SocketContext = createContext<{current: Socket | null}>({current:null});

export const SocketProvider = (props: {children: React.ReactNode}) => {

  let socket = useRef<Socket | null>(null)
  
  useEffect(() => {
    socket.current = io(`ws://localhost:8080`, { 
      withCredentials:true,
    })
  }, [])

  

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
