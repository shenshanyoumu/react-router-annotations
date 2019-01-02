import { matchPath, Router } from "react-router";

/**
 * 根据routes配置数组和给定的pathname返回匹配的组件数组
 * @param {*} routes 表示开发中的routes配置数组
 * @param {*} pathname 应用运行中的路由路径字符串
 * @param {*} branch 表示匹配到pathname的路由组件数组
 */
function matchRoutes(routes, pathname,  branch = []) {
  routes.some(route => {
    // 在编写routes数组时，数组元素对象包含path属性
    const match = route.path
      ? matchPath(pathname, route)
      : branch.length
        ? branch[branch.length - 1].match // use parent match
        : Router.computeRootMatch(pathname); // 一般根路由，对应的是home组件

    // 匹配成功，则将匹配信息保存在branch数组
    if (match) {
      branch.push({ route, match });

      // 由于routes数组允许组件嵌套，因此需要嵌套比较
      if (route.routes) {
        matchRoutes(route.routes, pathname, branch);
      }
    }

    return match;
  });

  return branch;
}

export default matchRoutes;
