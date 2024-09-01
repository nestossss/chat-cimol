import { useEffect, useState } from "react";
import { useSession } from "../../hooks/useSession";
import { ChatMessage } from "../ChatMessage/ChatMessage";
import './Chat.css';

import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function Chat({socket}){

  const [session, setSession] = useSession();
  const messages = session.salaAtual.messages;
  const pushMessage = (msgObj) => {
   setSession( prev => {
      return {
         ...prev,
         salaAtual: {
            ...prev.salaAtual,
            messages: prev?.salaAtual?.messages? prev.salaAtual.messages.concat([msgObj]) : null
         }
      }
   })
  }

  const ChatMessagesDoc = document.getElementById('message-list');
   useEffect( () => {
      if(ChatMessagesDoc){
         ChatMessagesDoc.scrollTo({ behavior: 'instant',  top: ChatMessagesDoc.offsetHeight + ChatMessagesDoc.scrollHeight})
      }
   }, [messages])

  useEffect( () => {
   if(!session.userId){
      return
   }

   console.log('will emit to "entrar na sala"')
   socket.emit('entrar na sala', {
      "idSala": session?.salaAtual?.id,
      "idUser": session.userId,
   })
   console.log('emitted to "entrar na sala"')

   console.log("listeners for chat: "+socket.listeners('chat'));
   console.log("has listeners: "+ socket.hasListeners('chat'));
   

   const controller = new AbortController();
   const signal = controller.signal;

   const fetchData = async () => {
      setSession( prev => {
         return { 
            ...prev,
            salaAtual: {
               ...prev.salaAtual,
               messages: null,
            }
         }
      })
      socket.emit('entrar na sala', JSON.stringify({
         "idSala": session.salaAtual.id,
         "idUser": session.id,
      }) );
      
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
      setSession( prev => {
         return {
            ...prev,
            salaAtual: {
               ...prev.salaAtual,
               messages: res?.data? res.data : [],
            }
         }
      })
   }

   
   if(session.salaAtual.id){
      fetchData();
   }
   return () => {
      // controller.abort();
   }
 }, [session.salaAtual.id]) 

 function handleSendMessage(e){
      e.preventDefault();
      let message = e.target.elements.messageInput.value;
      if(message == "") return
      e.target.elements.messageInput.value = "";
      if(message.length < 0) return;
      socket.emit('enviar mensagem', {
         "idUser": session.userId,
         "content": message,
      });
      let msgObj = {
         'content': message,
         'usuario': session.nick,
         'timestamp': Date.now(),
         'isSending': true,
      }
      pushMessage(msgObj);
   }

   if(session.salaAtual.id == null){
      return (
         <div className="col-md-9 h-100 ms-sm-auto col-lg-9 px-md-4 offset-md-3 offset-lg-2 d-flex justify-content-center align-items-center">
            <div className="d-flex justify-content-center align-items-center chat-warning">
               <h4 className="text-center align-middle">Entre em uma sala para iniciar a conversa</h4>
            </div>
         </div>
      )
   }
   if(messages == null){
      return (
         <div className="col-md-9 h-100 ms-sm-auto col-lg-9 px-md-4 offset-md-3 offset-lg-2 d-flex justify-content-center align-items-center">
            <div className="d-flex justify-content-center align-items-center chat-warning">
               <h4 className="text-center ">Carregando mensagens...</h4>
            </div>
         </div>
      )
   }

   return (
      <main className="col-md-9 ms-sm-auto col-lg-9 px-md-4 offset-md-3 offset-lg-2 d-flex flex-column ">
         <div className="chat-header p-3 border-bottom border-start">
            <h4>{session.salaAtual.nome}</h4>
            <p>Numero de pessoas online? </p>
         </div>
         <ol id="message-list" className="chat-messages d-flex flex-grow-1 p-3 overflow-auto border-start flex-column-reverse">
            <div>
               { messages.map( message => <ChatMessage userNick={session.nick} message={message} loading={ message?.isSending }/> ) }
            </div>
         </ol>
         <form onSubmit={handleSendMessage} className="chat-footer p-3 d-flex align-items-center border-top border-start">
            <i className="bi bi-emoji-smile me-2"></i>
            <input name="messageInput" type="text" onSubmit={e => {e.preventDefault()}} className="form-control chat-input me-2" placeholder="Enviar mensagem..."/>
            <button type="submit" className="btn btn-primary d-flex align-items-center">
              <i className="bi bi-send me-1"></i> Enviar
            </button>
         </form>
      </main>
      
   )
}

export { Chat }