import { WebSocketServer } from 'ws';
import { RoomService } from './services/room.service.ts';
import { AuthService } from './services/auth.service.ts';
import { RoomController } from './controllers/room.controller.ts';
import { AuthController } from './controllers/auth.controller.ts';
import { WSRouter } from './routes/ws.routes.ts';
import { RoomView } from './view/room.view.ts';
import { WinnersView } from './view/winners.view.ts';
import { AuthView } from './view/auth.view.ts';
import { ConnectionService } from './services/connection.sercive.ts';

export class App {
  private wss: WebSocketServer;
  private connectionService!: ConnectionService;
  private router!: WSRouter;

  constructor() {
    this.wss = new WebSocketServer({ port: 3000 });
    this.initializeDependencies();
    this.setupConnectionHandler();
  }

  private initializeDependencies() {
    const roomService = new RoomService();
    const authService = new AuthService();
    const connectionService = new ConnectionService();

    const roomView = new RoomView(this.wss);
    const winnersView = new WinnersView(this.wss);
    const authView = new AuthView(this.wss);

    const roomController = new RoomController(roomService, connectionService, roomView);
    const authController = new AuthController(
      authService,
      roomService,
      connectionService,
      authView,
      roomView,
      winnersView
    );

    this.connectionService = connectionService;

    this.router = new WSRouter(authController, roomController);
  }

  private setupConnectionHandler() {
    this.wss.on('connection', (ws) => {
      console.log('New client connected');

      this.router.setupRoutes(ws);
      
      ws.on('close', () => {
        console.log('Client disconnected');
        this.connectionService.unregisterConnection(ws);
      });
    });
  }
}