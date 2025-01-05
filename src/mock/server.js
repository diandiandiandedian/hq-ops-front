import jsonServer from 'json-server';
import path from 'path';

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();
const routes = path.join(__dirname, 'routes.json');

// 使用中间件
server.use(middlewares);

// 自定义路由
server.use(jsonServer.rewriter(require(routes)));

// 添加自定义逻辑
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = new Date().toISOString();
  }
  next();
});

// 使用默认路由
server.use(router);

// 启动服务
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});
