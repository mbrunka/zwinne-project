import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Cookies from "js-cookie";

const jwtToken = Cookies.get("token");
console.log(jwtToken)

const SOCKET_URL = `ws://localhost:8080/chat?access_token=${jwtToken}`;

const client = new Client({
  brokerURL: SOCKET_URL,
  connectHeaders: {
    Authorization: `Bearer ${jwtToken}`,
  },
  debug: (str) => {
    console.log(str);
  },
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
  webSocketFactory: () => new SockJS(SOCKET_URL),
});

console.log(client)

export const connect = (onConnect, onError) => {
  client.onConnect = onConnect;
  client.onStompError = onError;
  client.activate();
};

export const disconnect = () => {
  client.deactivate();
};

export const subscribe = (destination, callback) => {
  return client.subscribe(destination, callback);
};

export const sendMessage = (destination, body) => {
  client.publish({ destination, body: JSON.stringify(body) });
};