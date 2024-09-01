import { useContext, useState } from "react"
import "./ChatButton.css";
import chatImg from "../../assets/074b0dc22cc86206b5acc9af9e6ed506e32b595dbd5cf33ce0b7da5725931c2c.avif"
import { useSession } from "../../hooks/useSession";

function ChatButton({sala}) {

   const [session, setSession] = useSession();

   function handleChangeChat(e){
      e.preventDefault();
      setSession({
         ...session,
         salaAtual: {
            id: sala._id,
            nome: sala.nome,
            messages: session.salaAtual.messages,
         },
      });
   }

   return (
      <a onClick={handleChangeChat} class="list-group-item list-group-item-action bg-dark d-flex justify-content-between align-items-center">
         <div class="d-flex align-items-center">
            <img src={chatImg} class="rounded-circle me-2" alt="User Image"/>
            <div>
              <div>{sala.nome}</div>
              <small>Descrição...</small>
            </div>
         </div>
         <span class="badge bg-primary rounded-pill">1</span>
      </a>
   )
}

export {
   ChatButton
}