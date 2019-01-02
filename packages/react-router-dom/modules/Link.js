import React from "react";
import { __RouterContext as RouterContext } from "react-router";
import { createLocation } from "history";
import PropTypes from "prop-types";
import invariant from "tiny-invariant";

// 下面表示触发跳转事件时的键盘按键类别，对这些按键的触发的跳转行为应该忽略
function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

/**
 * The public API for rendering a history-aware <a>.
 */
class Link extends React.Component {
  handleClick(event, history) {
    if (this.props.onClick) {
      this.props.onClick(event);
    }

    // 
    if (
      !event.defaultPrevented && // onClick prevented default
      event.button === 0 && // ignore everything but left clicks
      (!this.props.target || this.props.target === "_self") && // let browser handle "target=_blank" etc.
      !isModifiedEvent(event) // ignore clicks with modifier keys
    ) {

      // 对于点击事件进行拦截，防止浏览器的默认行为（即页面刷新动作）
      event.preventDefault();

      // 调用history 对象的replace/push方法，从而在页面URL发生改变时能够阻止浏览器的刷新动作
      const method = this.props.replace ? history.replace : history.push;

      method(this.props.to);
    }
  }

  render() {
    const { innerRef, replace, to, ...rest } = this.props; // eslint-disable-line no-unused-vars

    return (
      <RouterContext.Consumer>
        {context => {
          invariant(context, "You should not use <Link> outside a <Router>");

          //将Link组件中的to字符串属性转换为对象形式
          const location =
            typeof to === "string"
              ? createLocation(to, null, null, context.location)
              : to;
          
          //用转换的to属性对象创建href跳转链接对象
          const href = location ? context.history.createHref(location) : "";

          //所以Link组件的实现基于<a>标签,有时候需要操作a实例，因此基于ref特性
          return (
            <a
              {...rest}
              onClick={event => this.handleClick(event, context.history)}
              href={href}
              ref={innerRef}
            />
          );
        }}
      </RouterContext.Consumer>
    );
  }
}

if (__DEV__) {
  const toType = PropTypes.oneOfType([PropTypes.string, PropTypes.object]);
  const innerRefType = PropTypes.oneOfType([PropTypes.string, PropTypes.func]);

  Link.propTypes = {
    innerRef: innerRefType,
    onClick: PropTypes.func,
    replace: PropTypes.bool,
    target: PropTypes.string,
    to: toType.isRequired
  };
}

export default Link;
