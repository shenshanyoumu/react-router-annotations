import React from "react";
import { Route } from "react-router";
import PropTypes from "prop-types";

import Link from "./Link";

// 可以使用classnames模块来合并多个class名称
function joinClassnames(...classnames) {
  return classnames.filter(i => i).join(" ");
}

/**
 * Link组件的封装组件，用于判定当前Link组件是否被触发
 */
function NavLink({
  "aria-current": ariaCurrent = "page",
  activeClassName = "active",
  activeStyle,
  className: classNameProp,
  exact,
  isActive: isActiveProp,
  location,
  strict,
  style: styleProp,
  to,
  ...rest
}) {
  const path = typeof to === "object" ? to.pathname : to;

  // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202
  const escapedPath = path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");

  return (
    <Route
      path={escapedPath}
      exact={exact}
      strict={strict}
      location={location}

      // 目前采用render props特性来实现逻辑复用；用于复用Route组件的部分属性
      children={({ location, match }) => {
        const isActive = !!(isActiveProp
          ? isActiveProp(match, location)
          : match);

        const className = isActive
          ? joinClassnames(classNameProp, activeClassName)
          : classNameProp;
        const style = isActive ? { ...styleProp, ...activeStyle } : styleProp;

        return (
          <Link
            aria-current={(isActive && ariaCurrent) || null}
            className={className}
            style={style}
            to={to}
            {...rest}
          />
        );
      }}
    />
  );
}

if (__DEV__) {
  const ariaCurrentType = PropTypes.oneOf([
    "page",
    "step",
    "location",
    "date",
    "time",
    "true"
  ]);

  // 页面的导航类NavLink 组件，内部封装Link组件
  NavLink.propTypes = {
    "aria-current": ariaCurrentType,
    activeClassName: PropTypes.string,
    activeStyle: PropTypes.object,
    className: PropTypes.string,
    exact: Route.propTypes.exact,
    isActive: PropTypes.func,
    location: PropTypes.object,
    strict: Route.propTypes.strict,
    style: PropTypes.object,
    to: Link.propTypes.to
  };
}

export default NavLink;
