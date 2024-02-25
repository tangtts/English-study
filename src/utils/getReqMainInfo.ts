import { Request } from 'express';

export  const getReqMainInfo: (req: Request) => {
  [prop: string]: any;
} = (req) => {
  const { query, headers, url, method, body } = req;

  // 获取 IP
  const xRealIp = headers['X-Real-IP'];
  const xForwardedFor = headers['X-Forwarded-For'];
  const { ip: cIp } = req;
  const ip = xRealIp || xForwardedFor || cIp;

  return {
    timestamp: new Date().toISOString(),
    url,
    host: headers.host,
    ip,
    method,
    query,
    body,
  };
};

