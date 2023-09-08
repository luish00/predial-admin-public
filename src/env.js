import app from './app.json';

export const devMode = app.devMode;
export const URL_BASE = devMode ? 'http://192.168.1.68:8881/api' : '';
