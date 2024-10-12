import { join } from 'path'
import * as yaml from 'js-yaml';
import * as fs from 'fs';

const configFileNameObj = {
  development: 'dev',
  production: 'prod'
}

const env = process.env.NODE_ENV || 'development';
let mergedConfig: Record<string, any> = {};


export default () => {
  const configs = ['./default.yaml', `./dev.yaml`];
  configs.reduce((prev, cur) => {
    return Object.assign(prev, yaml.load(loadYamlFile(cur)))
  }, mergedConfig)
  return mergedConfig
}
  console.log("🚀 ~ mergedConfig:", mergedConfig);

function loadYamlFile(file: string) {
  return fs.readFileSync(join(__dirname, file), 'utf-8');
}