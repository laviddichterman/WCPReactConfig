import { FulfillmentConfig, ICatalog, IWSettings } from '@wcp/wcpshared';
import { Middleware } from 'redux'
import { io, Socket } from "socket.io-client";
import { SOCKETIO, HOST_API } from '../../config';
import { SocketIoActions } from './SocketIoSlice';

const SocketIoMiddleware: Middleware = store => {
  let socket: Socket;
  
  return next => action => {
    if (SocketIoActions.startConnection.match(action)) {
      socket = io(`${HOST_API}/${SOCKETIO.ns}`, {
        autoConnect: true, secure: true,
        transports: ["websocket", "polling"],
        withCredentials: true
      });
      socket.on('connect', () => {
        store.dispatch(SocketIoActions.setConnected());  
        socket.on('disconnect', () => {
          store.dispatch(SocketIoActions.setFailed());
        });
      });
      socket.on("WCP_FULFILLMENTS", (data: Record<string, FulfillmentConfig>) => {
        console.log(data);
        store.dispatch(SocketIoActions.receiveFulfillments(data));
      });
      socket.on("WCP_SERVER_TIME", (data: { time: string; tz: string; }) => {
        store.dispatch(SocketIoActions.receiveServerTime(data));
      });
      socket.on("WCP_SETTINGS", (data: IWSettings ) => {
        console.log(data);
        store.dispatch(SocketIoActions.receiveSettings(data));
      });
      socket.on("WCP_CATALOG", (data: ICatalog ) => {
        console.log(data);
        store.dispatch(SocketIoActions.receiveCatalog(data));
      });

    }

    next(action);
  }
}

export default SocketIoMiddleware;