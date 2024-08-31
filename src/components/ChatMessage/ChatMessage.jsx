import profileImg from '../../assets/146e23c7-ba1a-4414-90da-3a1e93eab714.jpg';


function ChatMessage({message}) {
   return (
      <div className={message.isFromClient? "your-message": "message"}>
         <div className="d-flex align-items-center mb-3">
            <img src={profileImg} className="rounded-circle me-2" alt="User Image"/>
            <strong>{nick}</strong>
         </div>
         <p>{message}</p>
      </div>
   )
}

export {
   ChatMessage
}