import type { Request, Response } from 'express';
import express from 'express';
const router = express.Router();

import path from 'node:path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
import apiRoutes from './api/index.js';

router.use('/api', apiRoutes);

// serve up react front-end in production
router.use((_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

export default router;
