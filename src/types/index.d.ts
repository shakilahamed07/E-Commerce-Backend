
import { JwtPayload } from "jsonwebtoken";
import { Server as SocketIOServer } from "socket.io";

declare global {
    var socketIo: SocketIOServer | undefined;

    namespace Express {
        interface Request {
            user: JwtPayload;
        }
    }
}

export {};