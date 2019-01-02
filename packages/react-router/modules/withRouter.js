import React from "react";
import PropTypes from "prop-types";
import hoistStatics from "hoist-non-react-statics";

import Route from "./Route";

/**
 * 基于HOC形式对wrapped的组件添加路由属性
 */
function withRouter(Component) {
  const C = props => {
    const { wrappedComponentRef, ...remainingProps } = props;

    return (
      <Route
        children={routeComponentProps => (
          <Component
            {...remainingProps}
            {...routeComponentProps}
            ref={wrappedComponentRef}
          />
        )}
      />
    );
  };

  C.displayName = `withRouter(${Component.displayName || Component.name})`;
  C.WrappedComponent = Component;

  if (__DEV__) {
    C.propTypes = {
      wrappedComponentRef: PropTypes.func
    };
  }

  // 对于静态方法的拷贝
  return hoistStatics(C, Component);
}

export default withRouter;
