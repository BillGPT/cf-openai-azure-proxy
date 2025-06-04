// 主入口文件，监听 fetch 事件并调用处理函数
import { handleRequest } from './src/requestHandlers.js';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
