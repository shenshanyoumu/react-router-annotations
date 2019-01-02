"use strict";

// 在生产环境和开发环境引入的react-router-config打包文件
if (process.env.NODE_ENV === "production") {
  module.exports = require("./cjs/react-router-config.min.js");
} else {
  module.exports = require("./cjs/react-router-config.js");
}
