import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import socketIOClient from "socket.io-client";

// routes
import { SOCKETIO, HOST_API } from '../config';

// ----------------------------------------------------------------------

export const socketRoClient = socketIOClient(`${HOST_API}/${SOCKETIO.ns}`, { autoConnect: false, secure: true, cookie: false,     
  transports: ["websocket", "polling"], withCredentials: true
 });

const initialState = {
  socketRo: null,
  services: null,
  blockedOff: null,
  leadtime: null,
  settings: null,
  deliveryArea: null,
  catalog: null
};

const handlers = {
  INITIALIZE_CLIENT: (state, action) => {
    const { socketRo } = action.payload;
    return { ...state, socketRo };
  },
  SET_SERVICES: (state, action) => {
    const { services } = action.payload;
    return { ...state, services };
  },
  SET_BLOCKED_OFF: (state, action) => {
    const { blockedOff } = action.payload;
    return { ...state, blockedOff };
  },
  SET_LEADTIME: (state, action) => {
    const { leadtime } = action.payload;
    return { ...state, leadtime };
  },
  SET_SETTINGS: (state, action) => {
    const { settings } = action.payload;
    return { ...state, settings };
  },
  SET_DELIVERY_AREA: (state, action) => {
    const { deliveryArea } = action.payload;
    return { ...state, deliveryArea };
  },
  SET_CATALOG: (state, action) => {
    const { catalog } = action.payload;
    return { ...state, catalog };
  },
  DISCONNECT: (state) => ({
    ...state,
    socketRo: null
  }),
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const SocketIoContext = createContext({
  ...initialState,
});

// ----------------------------------------------------------------------

SocketIoProvider.propTypes = {
  children: PropTypes.node,
};



function SocketIoProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);


  useEffect(() => {
    const initialize = () => {
      try {
        dispatch({
          type: 'INITIALIZE_CLIENT',
          payload: { socketRo: socketRoClient },
        });

      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE_CLIENT',
          payload: { socketRo: null },
        });
      }
    };

    if (!socketRoClient) {
      initialize();
    }
    else {
      socketRoClient.open();
      socketRoClient.on("connect", () => {
        socketRoClient.on("WCP_SERVICES", data => { 
          dispatch({
            type: 'SET_SERVICES',
            payload: { services: data },
          });
          console.log(data);
        });
        socketRoClient.on("WCP_BLOCKED_OFF", data => {
          data.forEach((svcBlock, i) => {
            svcBlock.forEach((dayBlock, j) => {
              dayBlock[1].forEach((interval, k) => {
                data[i][j][1][k] = [Number(data[i][j][1][k][0]), Number(data[i][j][1][k][1])];
              })
            })
          })
          dispatch({
            type: 'SET_BLOCKED_OFF',
            payload: { blockedOff: data },
          });
          console.log(data);
        });
        socketRoClient.on("WCP_LEAD_TIMES", data => { 
          dispatch({
            type: 'SET_LEADTIME',
            payload: { leadtime: data },
          });
          console.log(data);
        });
        socketRoClient.on("WCP_SETTINGS", data => {
          dispatch({
            type: 'SET_SETTINGS',
            payload: { settings: data },
          });
          console.log(data);
        });
        socketRoClient.on("WCP_DELIVERY_AREA", data => {
          dispatch({
            type: 'SET_DELIVERY_AREA',
            payload: { deliveryArea: data },
          });
          console.log(data);
        });
        socketRoClient.on("WCP_CATALOG", data => {
          dispatch({
            type: 'SET_CATALOG',
            payload: { catalog: data },
          });
          console.log(data);
        });
      });
    }
    return () => {
      dispatch({
        type: 'DISCONNECT',
        payload: { socketRo: null },
      });
      socketRoClient.disconnect();
    };
  }, []);



  return (
    <SocketIoContext.Provider
      value={{
        ...state,
        socketRo: state?.socketRo,
        services: state?.services,
        blockedOff: state?.blockedOff,
        leadtime: state?.leadtime,
        settings: state?.settings,
        deliveryArea: state?.deliveryArea,
        catalog: state?.catalog
      }}
    >
      {children}
    </SocketIoContext.Provider>
  );
}

export { SocketIoContext, SocketIoProvider };
