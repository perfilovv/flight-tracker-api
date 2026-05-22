import { registerRoute } from '../../../app/router/index.ts';
import { createFlightController, getFlightController, getFlightsController } from '../controller/flights.controller.ts';

registerRoute('GET', '/api/flights', getFlightsController);

registerRoute('GET', '/api/flights/:id', getFlightController);

registerRoute('POST', '/api/flights', createFlightController);
