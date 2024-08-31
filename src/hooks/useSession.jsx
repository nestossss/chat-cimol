import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

function useSession() {
   const [credentials, setCredentials] = useContext(UserContext);
   return [credentials, setCredentials];
}

export { useSession }