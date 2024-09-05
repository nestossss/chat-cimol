import { useEffect, useState } from 'react'
import './ChatScreen.css';
import { ChatMessage } from '../../components/ChatMessage/ChatMessage';
import { ChatButton } from '../../components/ChatButton/ChatButton';
import axios from 'axios'
import { useSession } from '../../hooks/useSession';
import { CreateRoomModal } from '../../components/CreateRoomModal/CreateRoomModal';
import { Chat } from '../../components/Chat/Chat';
import { Navigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

function ChatScreen({socket}) {
  const controller = new AbortController();

  const [session, setSession ] = useSession();
  const [salas, setSalas] = useState(null);
  const [salasFound, setSalasFound] = useState(null);
  useEffect( () => {
    setSalasFound(salas);
  }, [salas])

  const [newRoomCount, setNewRoomCount] = useState();
  const [isModalVisible, setModalVisible] = useState();

  useEffect( () => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      let res = await axios.get(API_URL+'/salas', {
        signal,
        headers: {
          'id': session.userId,
          'token': session.token,
          'nick': session.nick,
        }
      }).catch( err => {
        console.log(err);
      })
      setSalas(res.data);
      setSalasFound(res.data);
    }
    fetchData();

    return () => {
        controller.abort();
    }
  }, [newRoomCount]) 

  function handleModalBtn(){

  }

  function handleSearch(e) {
    e.preventDefault();
    if(!salas) return;
    let search = e.target.value;
    let results = salas.filter((sala) => sala.nome.includes(search));
    setSalasFound(results);
  }

  //um monte de component hipotetico por enquanto
  // dentro de ListasChat vai ter a barra de pesquisa, e 

  if(!session.userId || !session.token || !session.nick){
    return <Navigate to='/' replace/>
  }
  if(!salas || !salasFound){
    return (
      <div className='loader-container d-flex align-items-center justify-content-center'>
        <div className='loader'></div>
      </div>
    )
  }
  return (
    <>
      <CreateRoomModal visibleState={[isModalVisible, setModalVisible]} roomCountState={[newRoomCount, setNewRoomCount]}/>
      <div className='chatScreen'>          
        <header id="header" className="header navbar navbar-dark bg-dark fixed-top">
          <div className="container-fluid">
              <a href="#" className="navbar-brand">Chat Cimol</a>
              <div className="d-flex">
                  <a href="/">
                    <button className="btn btn-outline-light">Logout</button>
                  </a>
              </div>
          </div>
        </header>


        <div className="container-fluid">
          <div className="row">
            <nav className="col-md-12 col-lg-3 d-md-block sidebar position-md-fixed h-100 ">
            <div className="position-sticky" style={{ top: 0 }}>
                <div className="p-3">
                    <div className="input-group">
                        <input type="text" onChange={handleSearch} className="form-control search-input" placeholder="Busque grupos"/>
                        <button className="btn btn-primary">
                          <i className="bi bi-search"></i>
                        </button>
                    </div>
                </div>
                <div className="list-group salas-list overflow-auto">
                    { salas.length <= 0?
                        <div className='d-flex align-items-center justify-content-center w-100 h-50'>
                          <h5 className='text-secondary'>Não existe nenhuma sala</h5>
                        </div>
                        : salasFound.map( (sala) => <ChatButton sala={sala}/> )                     
                    } 
                    <div className='criarSalaBtn bg-dark text-center p-4'>
                      <a className='textCriarSalaBtn'
                        onClick={(e) => {
                          e.preventDefault();
                          setModalVisible(true);
                        }}>
                        Clique aqui para criar uma sala
                      </a>
                    </div>
                </div>
            </div>
          </nav>
          <Chat socket={socket}/>
          
          </div>
        </div>  

      </div>
    </>
  )
}

export default ChatScreen
