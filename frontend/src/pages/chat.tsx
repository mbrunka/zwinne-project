import { useToastPromise } from "@/hooks/useToast";
import { Button, Flex } from "@chakra-ui/react";
import { Client } from "@stomp/stompjs";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { Chat } from "react-chat-module";
import "react-chat-module/dist/index.css";
import SockJS from "sockjs-client";
import Layout from "../components/Layout";

const PAGE_SIZE = 4;

const ChatPage = () => {
  const toast = useToastPromise();
  const [page, setPage] = useState(1);
  const email = Cookies.get("email");

  const [messages, setMessages] = useState([]);

  const socket = useRef(null);
  const stompClient = useRef<Client | null>(null);

  useEffect(() => {
    // Create a new STOMP client over the SockJS connection
    socket.current = new SockJS("http://localhost:8080/chat");
    stompClient.current = new Client({
      webSocketFactory: () => socket.current!,
    });

    stompClient.current.onConnect = (frame) => {
      stompClient.current!.subscribe("/topic/public", (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessages((prev) => {
          if (
            !prev.find((msg) => msg?.messageId === receivedMessage.id) &&
            receivedMessage.content
          ) {
            return [
              ...prev,
              {
                createdAt: new Date(receivedMessage.time),
                messageId: receivedMessage.id,
                senderId: receivedMessage.sender === email ? "1" : "2",
                profilePicture: "https://via.placeholder.com/150",
                type: "text",
                text: receivedMessage.content,
                name: receivedMessage.sender,
              },
            ];
          }
          return prev;
        });
      });
    };

    stompClient.current.activate();

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [email]);

  const handleSend = (message) => {
    if (stompClient.current?.connected) {
      const newMessage = {
        type: "CHAT",
        content: message.text,
        sender: email,
        time: new Date().toISOString(),
        id: `${new Date().getTime()}`, // Użyj znacznika czasu jako unikalnego identyfikatora
      };

      stompClient.current.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(newMessage),
      });
    } else {
      stompClient.current?.activate();
    }
  };

  const messagesToDisplay = messages.slice(-(page * PAGE_SIZE));

  return (
    <Layout>
      <Flex direction="column" height="90vh">
        {page * PAGE_SIZE < messages?.length && (
          <Button
            onClick={() => setPage((prevValue) => prevValue + 1)}
            style={{ margin: "auto auto" }}
          >
            Load more messages
          </Button>
        )}
        <Chat
          style={{ flex: 1, width: "100%" }}
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
