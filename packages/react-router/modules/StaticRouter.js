import React from "react";
import PropTypes from "prop-types";
import { createLocation, createPath } from "history";
import invariant from "tiny-invariant";
import warning from "tiny-warning";

import Router from "./Router";

// 在路径字符串开头添加“/”字符
function addLeadingSlash(path) {
  return path.charAt(0) === "/" ? path : "/" + path;
}

// 对给定的location字符串在开头添加网站访问基础路径，从而形成完成的路径字符串
function addBasename(basename, location) {
  if (!basename) return location;

  return {
    ...location,
    pathname: addLeadingSlash(basename) + location.pathname
  };
}

// 将location字符串中basename子串剥离
function stripBasename(basename, location) {
  if (!basename) return location;

  const base = addLeadingSlash(basename);

  if (location.pathname.indexOf(base) !== 0) return location;

  return {
    ...location,
    pathname: location.pathname.substr(base.length)
  };
}

// 基于history对象的createPath方法创建URL对象
function createURL(location) {
  return typeof location === "string" ? location : createPath(location);
}

// 无法处理go/goBack/goForward动作
function staticHandler(methodName) {
  return () => {
    invariant(false, "You cannot %s with <StaticRouter>", methodName);
  };
}

function noop() {}


/**
 * 静态路由器组件无法修改当前页面的URL，而只能将当前页面URL的变化记录在context对象中
 * 该组件主要用于测试和SSR
 */
class StaticRouter extends React.Component {

  // 下面将页面的URL变化记录在context对象中，而并没有触发页面变化动作
  navigateTo(location, action) {
    const { basename = "", context } = this.props;
    context.action = action;
    context.location = addBasename(basename, createLocation(location));
    context.url = createURL(context.location);
  }

  handlePush = location => this.navigateTo(location, "PUSH");
  handleReplace = location => this.navigateTo(location, "REPLACE");
  handleListen = () => noop;
  handleBlock = () => noop;

  render() {
    const { basename = "", context = {}, location = "/", ...rest } = this.props;

    // 
    const history = {
      createHref: path => addLeadingSlash(basename + createURL(path)),
      action: "POP",
      location: stripBasename(basename, createLocation(location)),
      push: this.handlePush,
      replace: this.handleReplace,

      // 下面动作要么警告要么没有实现
      go: staticHandler("go"),
      goBack: staticHandler("goBack"),
      goForward: staticHandler("goForward"),
      listen: this.handleListen,
      block: this.handleBlock
    };

    return <Router {...rest} history={history} staticContext={context} />;
  }
}

if (__DEV__) {
  StaticRouter.propTypes = {
    basename: PropTypes.string,
    context: PropTypes.object,
    location: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  };

  StaticRouter.prototype.componentDidMount = function() {
    warning(
      !this.props.history,
      "<StaticRouter> ignores the history prop. To use a custom history, " +
        "use `import { Router }` instead of `import { StaticRouter as Router }`."
    );
  };
}

export default StaticRouter;
