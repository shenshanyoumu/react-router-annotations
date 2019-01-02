export * from "react-router";

// 只有在浏览器环境才能使用下面两种路由器组件生成函数
export { default as BrowserRouter } from "./BrowserRouter";
export { default as HashRouter } from "./HashRouter";

export { default as Link } from "./Link";
export { default as NavLink } from "./NavLink";
