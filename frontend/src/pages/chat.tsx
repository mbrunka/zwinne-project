import { useToastPromise } from "@/hooks/useToast";
import { Button, Flex } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import Layout from "../components/Layout";

import { Chat, Message } from "react-chat-module";
import "react-chat-module/dist/index.css";

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
  ]);

  // append user typed message to messages array
  const handleSend = (message: Message) => {
    setMessages([
      ...messages,
      {
        messageId: `${messageId}`,
        senderId: "1",
        profilePicture: "https://via.placeholder.com/150",
        type: message.type,
        text: message.text,
        createdAt: message.createdAt,
        read: false,
      },
    ]);
  };

  const messagesToDisplay = useMemo(
    () => messages?.slice(-(page * PAGE_SIZE)),
    [messages, page]
  );

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
