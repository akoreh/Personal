import chalk from 'chalk';
import { format } from 'date-fns';

export class Logger {
  public static timestamp(): string {
    return format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  }

  public static error(message: string): void {
    console.error(chalk.red(`[ERROR] ${Logger.timestamp()} - ${message}`));
  }

  public static warn(message: string): void {
    console.warn(chalk.yellow(`[WARN] ${Logger.timestamp()} - ${message}`));
  }

  public static success(message: string): void {
    console.log(chalk.green(`[SUCCESS] ${Logger.timestamp()} - ${message}`));
  }

  public static info(message: string): void {
    console.log(chalk.blue(`[INFO] ${Logger.timestamp()} - ${message}`));
  }
}
