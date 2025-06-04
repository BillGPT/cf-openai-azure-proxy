// 请求处理相关函数

import { resourceName, mapper, apiVersion } from './config.js';
import { stream } from './utils.js';

// 入口请求处理
export async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    return handleOPTIONS();
  }

  const url = new URL(request.url);
  if (url.pathname.startsWith("//")) {
    url.pathname = url.pathname.replace('/', "");
  }

  let path = "";
  if (url.pathname === '/v1/chat/completions') {
    path = 'chat/completions';
  } else if (url.pathname === '/v1/images/generations') {
    path = 'images/generations';
  } else if (url.pathname === '/v1/completions') {
    path = 'completions';
  } else if (url.pathname === '/v1/models') {
    return handleModels();
  } else {
    return new Response('404 Not Found', { status: 404 });
  }

  let body;
  if (request.method === 'POST') {
    body = await request.json();
  }

  const modelName = body?.model;
  const deployName = mapper[modelName] || '';

  if (deployName === '') {
    return new Response('Missing model mapper', { status: 403 });
  }

  const fetchAPI = `https://${resourceName}.openai.azure.com/openai/deployments/${deployName}/${path}?api-version=${apiVersion}`;

  const authKey = request.headers.get('Authorization');
  if (!authKey) {
    return new Response('Not allowed', { status: 403 });
  }

  const payload = {
    method: request.method,
    headers: {
      'Content-Type': 'application/json',
      'api-key': authKey.replace('Bearer ', ''),
    },
    body: typeof body === 'object' ? JSON.stringify(body) : '{}',
  };

  let response = await fetch(fetchAPI, payload);
  response = new Response(response.body, response);
  response.headers.set('Access-Control-Allow-Origin', '*');

  if (body?.stream !== true) {
    return response;
  }

  const { readable, writable } = new TransformStream();
  stream(response.body, writable);
  return new Response(readable, response);
}

// 返回模型列表
export async function handleModels() {
  const data = {
    object: 'list',
    data: [],
  };

  for (const key in mapper) {
    data.data.push({
      id: key,
      object: 'model',
      created: 1677610602,
      owned_by: 'openai',
      permission: [{
        id: 'modelperm-M56FXnG1AsIr3SXq8BYPvXJA',
        object: 'model_permission',
        created: 1679602088,
        allow_create_engine: false,
        allow_sampling: true,
        allow_logprobs: true,
        allow_search_indices: false,
        allow_view: true,
        allow_fine_tuning: false,
        organization: '*',
        group: null,
        is_blocking: false,
      }],
      root: key,
      parent: null,
    });
  }

  const json = JSON.stringify(data, null, 2);
  return new Response(json, {
    headers: { 'Content-Type': 'application/json' },
  });
}

// 处理预检请求
export async function handleOPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
    },
  });
}
