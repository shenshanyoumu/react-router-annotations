"use strict";

var printWarning = function() {};

if (process.env.NODE_ENV !== "production") {
  printWarning = function(format, subs) {
    var index = 0;

    // 
    var message =
      "Warning: " +
      (subs.length > 0
        ? format.replace(/%s/g, function() {
            return subs[index++];
          })
        : format);

    if (typeof console !== "undefined") {
      console.error(message);
    }

    try {
      // --- Welcome to debugging React Router ---
      // This error was thrown as a convenience so that you can use the
      // stack trace to find the callsite that triggered this warning.
      throw new Error(message);
    } catch (e) {}
  };
}

// 由于整个项目的源码组织变化，在引入react-router-config的子模块时注意引入方式
// 注意下面字符串中存在两个“%s”替换字段，因此printWarning函数第二个参数[member,member]
module.exports = function(member) {
  printWarning(
    'Please use `require("react-router-config").%s` instead of `require("react-router-config/%s")`. ' +
      "Support for the latter will be removed in the next major release.",
    [member, member]
  );
};
