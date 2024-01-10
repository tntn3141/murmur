import { useContext } from "react";
import { ChatContext, UserChat } from "../context/ChatContext";
import { Container, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { useFetch } from "../hooks/useFetch";
import { baseUrl } from "../utils/services";
import ChatBox from "../components/chat/ChatBox";
import IndividualChat from "../components/chat/IndividualChat";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const { updateCurrentChat } = useContext(ChatContext);
  const { data, loading, error } = useFetch(`${baseUrl}/chats/${user._id}`);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>There was an error fetching data...</p>;
  }

  if (data) {
    return (
      <Container>
        <Stack direction="horizontal" gap={4} className="align-items-start">
          <Stack className="message-box flex-grow-0 pe-3" gap={3}>
            {data.map((chat: UserChat, index: number) => {
              return (
                <div key={index} onClick={() => updateCurrentChat(chat)}>
                  <IndividualChat chat={chat} user={user} />
                </div>
              );
            })}
          </Stack>
          <ChatBox />
        </Stack>
      </Container>
    );
  }
};

export default Chat;
