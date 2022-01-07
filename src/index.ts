import path from 'path';
import Express from 'express';
const app = Express();

import { Main } from "./modules/main";
import { Config } from "./types/config";

/*
    Setup global type definitions to allow custom object onto the global object
    these definitions are then available across all sub modules
*/
declare global {
    namespace NodeJS {
        interface Global {
            paths: {
                [key:string]: string;
            },
            config: Config
        }
    }
}

var args: any = false;
process.argv.slice(2).forEach((arg)=> {
  args = {};
  let split = arg.split('=');
  if(split.length > 1){
    args[split[0]] = split[1];
  } else {
    args[arg] = true;
  }
});

global.paths = {
    root: path.join(__dirname, '../')
}
global.paths.cache = path.join(global.paths.root, 'cache');
global.config = require(path.join(global.paths.root, 'config.json'));

console.log(global.config);


const main = new Main(
    app
);