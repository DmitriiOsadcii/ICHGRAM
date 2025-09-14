import 'dotenv/config';

import "dotenv/config";

import startServer from "./server";
import connectDatabase from "./db/connectDatabase";
import startWsServer from "./wwsServer"; 
const bootStrap = async () => {
  await connectDatabase();
  startServer();   // HTTP API на 3000
  startWsServer(); // WS на 5000
};

bootStrap();