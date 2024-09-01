import { useEffect, useState } from "react";
import { useSession } from "../../hooks/useSession"
import { ChatMessage } from "../ChatMessage/ChatMessage";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;

function Chat(){
   const socket = io(API_URL+"/chat");
   socket.on('chat', (message) => {
      
   })

   const [session] = useSession();
   const [messages, setMessages] = useState([]);

  useEffect( () => {
   const controller = new AbortController();
   const signal = controller.signal;

   const fetchData = async () => {
     let res = await axios.get(API_URL+'/salas/mensagens?idSala='+session.salaAtual.id, {
       signal,
       headers: {
         'id': session.userId,
         'token': session.token,
         'nick': session.nick,
       }
     }).catch( err => {
       console.log(err);
     })
     setMessages(res?.data);
   }
   if(session.salaAtual.id){
      fetchData();
   }

   return () => {
       controller.abort();
   }
 }, [session.salaAtual.id]) 

   if(session.salaAtual.id == null){
      return (
         <div className="w-100 h-100 d-flex justify-content-center align-items-center">
            <h4>Entre em uma sala para iniciar a conversa</h4>
         </div>
      )
   }
   return (
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 offset-md-3 offset-lg-2 d-flex flex-column ">
         <div className="chat-header p-3 border-bottom border-start">
            <h4>{session.salaAtual.nome}</h4>
            <p>Numero de pessoas online? </p>
         </div>
         <ol className="chat-messages flex-grow-1 p-3 overflow-auto border-start">
            {
               messages.map( message => <ChatMessage message={message} /> )
            }
         </ol>
         <div className="chat-footer p-3 d-flex align-items-center border-top border-start">
            <i className="bi bi-emoji-smile me-2"></i>
            <input type="text" className="form-control chat-input me-2" placeholder="Enviar mensagem..."/>
            <button className="btn btn-primary d-flex align-items-center">
              <i className="bi bi-send me-1"></i> Enviar
            </button>
         </div>
      </main>
   )
}

export { Chat }