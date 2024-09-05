import { Link, Navigate } from "react-router-dom";
import { useSession } from "../hooks/useSession";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { CreateRoomModal } from "../components/CreateRoomModal/CreateRoomModal";

const API_URL = import.meta.env.VITE_API_URL;

function Entrar() {

   
   const [session, setSession] = useSession();
   const [entrou , setEntrou] = useState(false);
   
   function handleSubmit(e){
      
      (async function(){
         
         e.preventDefault();
         let nick = e?.target?.elements?.nick?.value?.trim();
         e.target.elements.nick.value = "";
         
         if(nick?.length > 0){
            setEntrou(true);
         let res = await axios.post(API_URL+'/usuario/entrar', {
            nick: nick,
         } , {
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded',
            }
         }).catch( err => {
            if(!axios.isCancel(err)) return console.log(err);
            return console.log("Requisição cancelada")
         });
         if(res?.status == 200){
            return setSession({
               userId: res.data.idUser,
               token: res.data.token,
               nick: nick,
               salaAtual: {
                  ...session.salaAtual
               },
               isAuthenticated: true,
            });
         }
         return setEntrou(false);
      }
      else console.log('input vazio')
   })();
   }
   
   if(session.isAuthenticated){
      return <Navigate to={'chat'}/>
   }
   
   if(entrou){
      return <div>
         <div className="d-flex justify-content-center align-items-center flex-column" style={{ minHeight: '100vh'}}> 
            <h3 className="text-center">Entrando no chat...</h3>
            <h6 className="text-center text-secondary">(pode demorar um pouco)</h6>   
         </div>
      </div>
   }
   return (
      <>         
         <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh'}}> 
            <div className="card p-4 text-white" style={{backgroundColor: '#23272A', width: '100%', maxWidth: 400}}>
               <h1 className="mb-4 text-center">Entrar no chat</h1>
               <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                     <label for='nick' className="form-label">Nick</label>
                     <input type="text" autoComplete="off" className="form-control" id="nick" placeholder={"Digite seu nick"}/>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                     <button type="submit" className="btn btn-primary">Entrar</button>
                  </div>
               </form>
            </div>
         </div>
      </>
   )
} 

export default Entrar