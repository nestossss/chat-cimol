import profileImg from '../../assets/146e23c7-ba1a-4414-90da-3a1e93eab714.jpg';
import './ChatMessage.css'

function ChatMessage({userNick, message, loading}) {
   return (
      <div className={userNick == message.usuario? "your-message" : "message"}>
         <div className="d-flex align-items-center mb-3">
            <img src={profileImg} className="rounded-circle" alt="User Image"/>
            <strong>{message.usuario}</strong>
         </div>
         <p>{message.content}</p>
      </div>
   )
}

export {
   ChatMessage
}