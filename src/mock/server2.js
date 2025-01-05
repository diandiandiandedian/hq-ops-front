// 检查你的项目是否为 ESM 或 CommonJS，根据情况选择合适的导入方式
import jsonServer from 'json-server'; // 如果你的项目是 ESM
// const jsonServer = require('json-server'); // 如果是 CommonJS

// 创建 JSON Server
const server = jsonServer.create();
const router = jsonServer.router({ posts: [{ id: 1, title: 'Mock API Post' }] });
const middlewares = jsonServer.defaults();

// 使用中间件和路由
server.use(middlewares);
server.use(router);

// 启动服务
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running at http://localhost:${PORT}`);
});
