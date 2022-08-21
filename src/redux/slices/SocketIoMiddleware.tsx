import { SOCKETIO, HOST_API } from '../../config';
import { SocketIoMiddleware as MiddlewareGenerator } from '@wcp/wario-ux-shared';

export const SocketIoMiddleware = MiddlewareGenerator(HOST_API, SOCKETIO.ns as string);