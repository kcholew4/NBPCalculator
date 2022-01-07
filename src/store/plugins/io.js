import { io } from "socket.io-client";

export default function createSocketPlugin() {
  return (store) => {
    const socket = io(process.env.VUE_APP_API_URL);

    socket.on("connect", () => {
      store.commit("SOCKET_IO_CONNECTED");
    });

    socket.on("disconnect", () => {
      store.commit("SOCKET_IO_DISCONNECTED");
    });

    store.$socket = socket;
  };
}
