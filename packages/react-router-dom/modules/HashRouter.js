import React from "react";
import { Router } from "react-router";
import { createHashHistory as createHistory } from "history";
import PropTypes from "prop-types";
import warning from "tiny-warning";

/**
 * 基于window.location.hash创建的Router组件，浏览器环境中页面的URL hash部分变化并不会触发页面重新加载
 */
class HashRouter extends React.Component {
  history = createHistory(this.props);

  render() {
    return <Router history={this.history} children={this.props.children} />;
  }
}

if (__DEV__) {
  HashRouter.propTypes = {
    basename: PropTypes.string,
    children: PropTypes.node,
    getUserConfirmation: PropTypes.func,
    hashType: PropTypes.oneOf(["hashbang", "noslash", "slash"])
  };

  HashRouter.prototype.componentDidMount = function() {
    warning(
      !this.props.history,
      "<HashRouter> ignores the history prop. To use a custom history, " +
        "use `import { Router }` instead of `import { HashRouter as Router }`."
    );
  };
}

export default HashRouter;
