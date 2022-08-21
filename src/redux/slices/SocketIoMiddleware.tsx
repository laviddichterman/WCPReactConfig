import { SOCKETIO, HOST_API } from '../../config';
import type { RootState } from '../store';
import { SocketIoMiddleware as MiddlewareGenerator } from '@wcp/wario-ux-shared';

export const SocketIoMiddleware = MiddlewareGenerator<RootState>(HOST_API, SOCKETIO.ns as string);