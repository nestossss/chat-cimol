import { useEffect, useState } from "react";
import { useSession } from "../hooks/useSession"
import { ChatMessage } from "./ChatMessage/ChatMessage";
function Chat(){

   useEffect( () => {
      
   }, []);
   const [session] = useSession();
   const [messages, setMessages] = useState([]);

   return (
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 offset-md-3 offset-lg-2 d-flex flex-column ">
         <div className="chat-header p-3 border-bottom border-start">
            <h4>{sala.nome}</h4>
            <p>Numero de pessoas online</p> { /* ver isso dps */}
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