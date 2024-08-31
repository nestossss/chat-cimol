import { Link, Navigate } from "react-router-dom";
import { useSession } from "../hooks/useSession";
import axios from "axios";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Entrar() {

   const [session, setSession] = useSession();

   async function handleSubmit(e){
      const controller = new AbortController();
      controller.abort();
      controller.signal = {};

      e.preventDefault();
      let nick = e?.target?.elements?.nick?.value?.trim();
      if(nick){
         let res = await axios.post(API_URL+'/usuario/entrar', {
            nick: nick,
         } , {
            signal: controller.signal,
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded',
            }
         }).catch( err => console.log(err));
         if(res?.status == 200){
            return setSession({
               userId: res.data.idUser,
               token: res.data.token,
               nick: nick,
               salaAtual: null,
               isAuthenticated: true,
            });
         }
         return console.log('nao foi');
      }
      console.log('input vazio');
   }

   if(session.isAuthenticated){
      return <Navigate to={'chat'}/>
   }

   return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh'}}> 
         <div className="card p-4 text-white" style={{backgroundColor: '#23272A', width: '100%', maxWidth: 400}}>
            <h1 className="mb-4 text-center">Entrar no chat</h1>
            <form onSubmit={handleSubmit}>
               <div className="mb-3">
                  <label for='nick' className="form-label">Email</label>
                  <input type="text" className="form-control" id="nick" placeholder="Digite seu nick"/>
               </div>
               <div className="d-flex justify-content-between align-items-center">
                  <button type="submit" className="btn btn-primary">Entrar</button>
               </div>
            </form>
         </div>
      </div>
   )
} 

export default Entrar