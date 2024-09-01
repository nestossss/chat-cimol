import { 
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import './App.css';
import ChatScreen from './screens/ChatScreen/ChatScreen';
import Entrar from './screens/Entrar'
import { UserContext } from './contexts/UserContext';
import { useState } from 'react';



const router = createBrowserRouter([{
    path: '/',
    element: <Entrar/>,
  }, {
    path: 'chat',
    element: <ChatScreen/>
  }])

function App() {

  const [authInfo, setAuthInfo] = useState({
    nick: null,
    token: null,
    userId: null,
    salaAtual: {
      id: null,
      nome: null,
    },
    isAuthenticated: false,
  });
  
  return (
    <UserContext.Provider value={[authInfo, setAuthInfo]}>
      <RouterProvider router={router}/>
    </UserContext.Provider>
  )
}

export default App
