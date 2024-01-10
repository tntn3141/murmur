import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { baseUrl, getRequest } from "../../utils/services";

const Friends = (id) => {
  const {  user } = useContext(AuthContext)
  const userId = user._id;

  useEffect( async () => {
    const response = getRequest(`${baseUrl}/friends/${userId}`)
  }, [user])

  return (
    <>
      Friends
    </>
  );
}
 
export default Friends;