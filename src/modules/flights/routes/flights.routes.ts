import { registerRoute } from '../../../app/router/index.ts';
import { flightsController } from '../controller/flights.controller.ts';

registerRoute('GET', '/api/flights', flightsController.getAll);

registerRoute('GET', '/api/flights/stats', flightsController.getStats);

registerRoute('GET', '/api/flights/:id', flightsController.getById);

registerRoute('POST', '/api/flights', flightsController.create);

registerRoute('PATCH', '/api/flights/:id/status', flightsController.updateStatus);

registerRoute('DELETE', '/api/flights/:id', flightsController.remove);

