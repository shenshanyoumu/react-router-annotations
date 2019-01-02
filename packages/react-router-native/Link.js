import React from "react";
import { TouchableHighlight } from "react-native";
import PropTypes from "prop-types";

import { __RouterContext as RouterContext } from "react-router";

class Link extends React.Component {
  // 默认的Link组件使用TouchableHighlight组件
  static defaultProps = {
    component: TouchableHighlight,
    replace: false
  };

  handlePress = (event, history) => {
    if (this.props.onPress) this.props.onPress(event);

    if (!event.defaultPrevented) {
      const { to, replace } = this.props;

      // 基于history对象的replace/push方法处理路由跳转
      if (replace) {
        history.replace(to);
      } else {
        history.push(to);
      }
    }
  };

  render() {
    const { component: Component, to, replace, ...rest } = this.props;

    return (
      <RouterContext.Consumer>
        {context => (
          <Component
            {...rest}
            onPress={event => this.handlePress(event, context.history)}
          />
        )}
      </RouterContext.Consumer>
    );
  }
}

const __DEV__ = true; // TODO

if (__DEV__) {
  Link.propTypes = {
    onPress: PropTypes.func,
    component: PropTypes.func,
    replace: PropTypes.bool,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  };
}

export default Link;
