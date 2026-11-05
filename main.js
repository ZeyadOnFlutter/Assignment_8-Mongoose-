import './src/Config/config.js';
import express from 'express';
import { bootstrap } from './src/app.controller.js';
const PORT = Number(process.env.PORT);
const app = express();

bootstrap(app, express, PORT);
