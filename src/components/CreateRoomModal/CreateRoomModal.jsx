import { useRef, useState } from "react"
import { useSession } from "../../hooks/useSession";
import './CreateRoomModal.css';
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function CreateRoomModal({visibleState, roomCountState}){

   const [session, setSession] = useSession();

   const [visible, setVisible] = visibleState;
   const [, setRoomCount] = roomCountState;

   const [salvarChecked, setSalvarChecked] = useState();

   async function handleSalvar(e){
      let nome = e.target.elements.inputNome.value?.trim();
      let senha = e.target.elements.inputSenha.value?.trim();
      e.preventDefault();
      setVisible(false);

      if(nome.length <= 0 || (salvarChecked && senha.length <= 0))
         return;
      let headers = { 
         'Content-Type': 'application/x-www-form-urlencoded',
         token: session.token,
         id: session.userId,
         nick: session.nick ,
      }
      let data = { 
         nome,
         senha
      }
      let res = await axios.post(API_URL+'/salas/criar', data, { headers })
      .catch(err => console.log(err))
      if(res?.status != 200) return;
      setRoomCount( prev => prev + 1 );
      setSession({
         ...session,
         salaAtual: {
            ...session.salaAtual,
            id: res?.data?.idSala? res.data.idSala : null,
         },
      })
   } 

   return (
      <div onClick={ (e) => {
         if(e.target == e.currentTarget){
            setVisible(false);
         }
      }} className={"w-100 h-100 justify-content-center align-items-center "+(visible? "d-flex" : "d-none")} style={{ zIndex: 1, position: "absolute"}}>
         <form  onSubmit={handleSalvar} name="formSalvar" className="bg-white p-5 d-flex flex-column" style={{borderRadius: 20}}>
            <input name="inputNome" type="text" placeholder="Nome da sala" />
            <input name="inputSenha" disabled={!salvarChecked} type="text"  placeholder="Senha da sala"/>
            <div className="d-flex py-2">
               <input className="d-flex m-0 checkBox" onClick={(e) => { setSalvarChecked(e.target.checked) }} id="checkSalvar" name="checkSalvar" type="checkbox" />
               <p className="text-check-btn m-0 px-2 h-100">Criar com senha</p>
            </div>
            <button type="submit">
               Criar sala
            </button>
         </form>
      </div>
   )
}

export { CreateRoomModal }