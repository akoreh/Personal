import chalk from 'chalk';
import express from 'express';

import { appConfig } from './config/app.config';
import { registerAppMiddlewares } from './middlewares/app.middleware';
import { Logger } from './services/logger.service';

const app = express();

registerAppMiddlewares(app);

app.get('/', (req, res) => {
  res.send('Working');
});

app.listen(appConfig.port, async () => {
  console.log();

  console.log(chalk.magentaBright('🚀🚀🚀'));
  console.log(chalk.cyanBright(`[APP READY] ${Logger.timestamp()}`));
  console.log(
    chalk.magentaBright(
      `API ready on ${appConfig.host}:${appConfig.port} in ${appConfig.env} mode`,
    ),
  );
  console.log(chalk.magentaBright('🚀🚀🚀'));
});
