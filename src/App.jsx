import { 
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import './App.css';
import ChatScreen from './screens/ChatScreen/ChatScreen';
import Entrar from './screens/Entrar'
import { UserContext } from './contexts/UserContext';
import { useEffect, useState } from 'react';
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;

const socket = io(API_URL, {
      path: '/chat',
      autoConnect: false,
});

const router = createBrowserRouter([{
    path: '/',
    element: <Entrar/>,
  }, {
    path: 'chat',
    element: <ChatScreen socket={socket}/>
  }])

function App() {

  useEffect(() => {
   socket.connect();
   socket.on('chat', listenerChat);
    
   return () => {
    socket.off('chat', listenerChat);
    socket.disconnect();

    console.log('page reload, listener from "chat" off');
   }
  }, [])

  const [authInfo, setAuthInfo] = useState({
    nick: null,
    token: null,
    userId: null,
    salaAtual: {
      id: null,
      nome: null,
      messages: [],
    },
    isAuthenticated: false,
  });
  
  const listenerChat = (...args) => {
    if(args.length == 1 || !args.length){
      if(typeof args[0] == 'object' && args[0].content && args[0].usuario && args[0].timestamp && authInfo.salaAtual.messages != null){
        return setAuthInfo( prev => {
          return {
            ...prev,
            salaAtual: {
              ...prev.salaAtual,
              messages: prev.salaAtual.messages.length > 0? prev.salaAtual.messages.concat([args[0]]) : [args[0]],
            }
        }})
      }
      if(typeof args[0] == 'string'){
        return console.log(args[0]);
      }
    }
    console.log('args wouldnt be an array')
    console.log(args)
    
  }
  

  return (
    <UserContext.Provider value={[authInfo, setAuthInfo]}>
      <RouterProvider router={router}/>
    </UserContext.Provider>
  )
}

export default App
