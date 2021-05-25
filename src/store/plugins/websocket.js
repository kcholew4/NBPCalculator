const socket = new WebSocket(process.env.VUE_APP_API_URL);

function waitForWebSocket(store, callback) {
  if (!store.state.webSocketConnected) {
    const unwatch = store.watch(
      (state) => state.webSocketConnected,
      (newValue) => {
        if (newValue) {
          callback();
          unwatch();
        }
      }
    );
  } else {
    callback();
  }
}

export default function createWebSocketPlugin() {
  return (store) => {
    store.subscribe((mutation) => {
      if (mutation.type === "FETCH_DATA") {
        waitForWebSocket(store, () =>
          socket.send(JSON.stringify(mutation.payload))
        );
      }
    });

    socket.onopen = () => {
      store.commit("WEBSOCKET_CONNECTED");

      setInterval(() => socket.send("ping"), 50000);
    };

    socket.onmessage = ({ data }) => {
      //We send ping every 50 seconds, so we get pong :)
      if (data === "pong") {
        return;
      }

      const { id, response } = JSON.parse(data);

      switch (id) {
        case 1:
          store.commit("SET_RANGE", response);
          store.commit("STOP_FETCHING");
          break;
        case 2:
          store.commit("SET_DISABLED_DAYS", response);
          store.commit("STOP_FETCHING");
          break;
        case 3:
          store.commit("SET_TABLE", response);
          store.commit("STOP_FETCHING");
          break;
        default:
          break;
      }
    };
  };
}
