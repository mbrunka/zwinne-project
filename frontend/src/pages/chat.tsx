import { useToastPromise } from "@/hooks/useToast";
import { Button, Flex } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { connect, disconnect, subscribe, sendMessage } from "../utils/WebSocketUtil"
import Cookies from "js-cookie";
import { Chat, Message } from "react-chat-module";
import "react-chat-module/dist/index.css";

const jwtToken = Cookies.get("token");
console.log(jwtToken)

const SOCKET_URL = 'ws://localhost:8080/chat';

const PAGE_SIZE = 4;

const ChatPage = () => {
  const toast = useToastPromise();
  const [page, setPage] = useState(1);
  const [messages, setMessages] = useState([
    {
      createdAt: new Date(Date.now()),
      messageId: "1",
      senderId: "1",
      profilePicture: "https://via.placeholder.com/150",
      type: "text",
      text: "Hello, how are you?",
      name: "John Doe",
    },
    {
      createdAt: new Date(Date.now() + 2000),
      messageId: "2",
      senderId: "2",
      profilePicture: "https://via.placeholder.com/150",
      type: "text",
      text: "I'm fine, and you?",
    },
    {
      createdAt: new Date(Date.now()),
      messageId: "3",
      senderId: "1",
      profilePicture: "https://via.placeholder.com/150",
      type: "text",
      text: "Hello, how are you?",
      name: "John Doe",
    },
    {
      createdAt: new Date(Date.now() + 2000),
      messageId: "4",
      senderId: "2",
      profilePicture: "https://via.placeholder.com/150",
      type: "text",
      text: "I'm fine, and you?",
    },
    {
      createdAt: new Date(Date.now()),
      messageId: "5",
      senderId: "1",
      profilePicture: "https://via.placeholder.com/150",
      type: "text",
      text: "Hello, how are you?",
      name: "John Doe",
    },
    {
      createdAt: new Date(Date.now() + 2000),
      messageId: "6",
      senderId: "2",
      profilePicture: "https://via.placeholder.com/150",
      type: "text",
      text: "I'm fine, and you?",
    },
    {
      createdAt: new Date(Date.now()),
      messageId: "7",
      senderId: "1",
      profilePicture: "https://via.placeholder.com/150",
      type: "text",
      text: "Hello, how are you?",
      name: "John oe",
    },
    {
      createdAt: new Date(Date.now() + 2000),
      messageId: "8",
      senderId: "2",
      profilePicture: "https://via.placeholder.com/150",
      type: "text",
      text: "I'm fine, and you?",
    },
    {
      createdAt: new Date(Date.now()),
      messageId: "9",
      senderId: "1",
      profilePicture: "https://via.placeholder.com/150",
      type: "text",
      text: "Hello, how are you?",
      name: "John Doe",
    },
    {
      createdAt: new Date(Date.now() + 2000),
      messageId: "10",
      senderId: "2",
      profilePicture: "https://via.placeholder.com/150",
      type: "text",
      text: "I'm fine, and you?",
    },
    {
      createdAt: new Date(Date.now()),
      messageId: "11",
      senderId: "1",
      profilePicture: "https://via.placeholder.com/150",
      type: "text",
      text: "Hello, how are you?",
      name: "John Doe",
    },
    {
      createdAt: new Date(Date.now() + 2000),
      messageId: "12",
      senderId: "2",
      profilePicture: "https://via.placeholder.com/150",
      type: "text",
      text: "I'm fine, and you?",
    },
  ]);

  const handleSend = (message) => {
    const newMessage = {
      senderId: '1', // Adjust this to the correct sender ID
      profilePicture: 'https://via.placeholder.com/150',
      type: message.type,
      text: message.text,
      createdAt: new Date(),
    };
    sendMessage('/app/chat.sendMessage', newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  useEffect(() => {
    const onConnect = () => {
      console.log('Connected to WebSocket');
      subscribe('/topic/public', (msg) => {
        const receivedMessage = JSON.parse(msg.body);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      });
    };

    const onError = (error) => {
      console.log('WebSocket error: ', error);
    };

    connect(onConnect, onError);

    return () => {
      disconnect();
    };
  }, []);

  const messagesToDisplay = messages.slice(-(page * PAGE_SIZE));



  return (
    <Layout>
      <Flex direction="column">
        {page * PAGE_SIZE < messages?.length && (
          <Button
            onClick={() => setPage((prevValue) => prevValue + 1)}
            style={{ margin: "auto auto" }}
          >
            Load more messages
          </Button>
        )}
        <Chat
          style={{ width: "40%", position: "relative" }}
          userId={"1"}
          messages={messagesToDisplay}
          onSend={handleSend}
        />
      </Flex>
    </Layout>
  );
};

ChatPage.auth = true;
ChatPage.roles = ["NAUCZYCIEL", "STUDENT"];

export default ChatPage;
