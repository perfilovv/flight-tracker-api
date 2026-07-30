import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class FlightsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    console.log('connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('disconnected:', client.id);
  }

  @SubscribeMessage('flights:subscribe')
  handleSubscribe(client: Socket, flightId: string) {
    client.join(`flight:${flightId}`);
    return { status: 'subscribed', flightId };
  }
}
