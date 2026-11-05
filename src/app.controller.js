import { dbConnection } from './DB/connection.js';
import { globalErrorHandler } from './Middleware/error.middleware.js';
import { userRouter, noteRouter } from './Modules/index.js';
export const bootstrap = async (app, express, PORT) => {
  app.use(express.json());
  await dbConnection(app, PORT);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/notes', noteRouter);

  app.all('/*dummy', async (req, res) => {
    return res.status(404).json({
      status: 404,
      message: 'Route not found',
    });
  });

  app.use(globalErrorHandler);
};
