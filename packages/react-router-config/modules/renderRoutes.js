import React from "react";
import { Switch, Route } from "react-router";

/**
 * 
 * @param {*} routes 数组为开发中编写的路由配置数组
 * @param {*} extraProps 传递该渲染组件的其他属性
 * @param {*} switchProps 传递给Switch组件的属性
 */
function renderRoutes(routes, extraProps = {}, switchProps = {}) {
  return routes ? (
    <Switch {...switchProps}>
      {routes.map((route, i) => (
        <Route
          key={route.key || i}
          path={route.path}
          exact={route.exact}
          strict={route.strict}
          render={props =>
            route.render ? (
              route.render({ ...props, ...extraProps, route: route })
            ) : (
              <route.component {...props} {...extraProps} route={route} />
            )
          }
        />
      ))}
    </Switch>
  ) : null;
}

export default renderRoutes;
