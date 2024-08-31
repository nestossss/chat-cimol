import { useEffect, useState } from 'react'
import './ChatScreen.css';
import { ChatMessage } from '../../components/ChatMessage/ChatMessage';
import { ChatButton } from '../../components/ChatButton/ChatButton';
import axios from 'axios'
import { useSession } from '../../hooks/useSession';

const API_URL = import.meta.env.API_URL;

function ChatScreen() {
  const controller = new AbortController();

  const [session, setSession ] = useSession();
  const [salas, setSalas] = useState(null);

  useEffect( () => {
    
    const fetchData = async () => {
      let res = await axios.get(API_URL+'/salas', {
        headers: {
          'id': session.userId,
          'token': session.token,
          'nick': session.nick,
        }
      }).catch( err => {
        console.log(err);
      })
      setSalas(res.data)
      
      return () =>{
        
      }
    }
    fetchData();

    return () => {

    }
  }, []) 
  //um monte de component hipotetico por enquanto
  // dentro de ListasChat vai ter a barra de pesquisa, e 
  if(!salas){
    return (
      <div className='loader-container d-flex align-items-center justify-content-center'>
        <div className='loader'></div>
      </div>
    )
  }
  if(salas.length <= 0){
    return (
      <div className='d-flex align-items-center justify-content-center'>
        <h4 className='text-white'>Não existe nenhuma sala</h4>
      </div>
    )
  }
  return (
    <>
      <div className='chatScreen'> 
        <header className="header navbar navbar-dark bg-dark fixed-top">
          <div className="container-fluid">
              <a href="#" className="navbar-brand">Chat Cimas</a>
              <div className="d-flex">
                  <button className="btn btn-outline-light me-2">Perfil</button>
                  <a href="">
                    <button className="btn btn-outline-light">Logout</button>
                  </a>
              </div>
          </div>
        </header>


        <div className="container-fluid">
          <div className="row">
            <nav className="col-md-3 col-lg-2 d-md-block sidebar position-fixed h-100">
            <div className="position-sticky"> { /*style="top: 0;*/}
                <div className="p-3">
                    <div className="input-group">
                        <input type="text" className="form-control search-input" placeholder="Busque grupos"/>
                        <button className="btn btn-primary">
                          <i className="bi bi-search"></i>
                        </button>
                    </div>
                </div>
                <div className="list-group overflow-auto"> {/*style="height: calc(100vh - 100px);"*/}
                    { salas.map( (sala) => {
                      return <ChatButton chat={sala}/>
                    })}
                </div>
            </div>
          </nav>
          <Chat sala={session.salaAtual}/>

          </div>
        </div>  

      </div>
    </>
  )
}

export default ChatScreen
