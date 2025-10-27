import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logDir = path.join(__dirname, '../../logs');

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const getTimestamp = (): string => {
  return new Date().toISOString();
};

const writeToFile = (level: string, message: string, data?: any) => {
  const logFile = path.join(logDir, `app-${new Date().toISOString().split('T')[0]}.log`);
  const logMessage = `[${getTimestamp()}] [${level}] ${message} ${data ? JSON.stringify(data) : ''}\n`;
  
  fs.appendFileSync(logFile, logMessage);
};

export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data || '');
    writeToFile('INFO', message, data);
  },
  
  error: (message: string, data?: any) => {
    console.error(`[ERROR] ${message}`, data || '');
    writeToFile('ERROR', message, data);
  },
  
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data || '');
    writeToFile('WARN', message, data);
  },
  
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data || '');
      writeToFile('DEBUG', message, data);
    }
  },
};
