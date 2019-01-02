"use strict";

// 在应用开发中，针对开发环境和生产环境提供不同的react-router模块
if (process.env.NODE_ENV === "production") {
  module.exports = require("./cjs/react-router.min.js");
} else {
  module.exports = require("./cjs/react-router.js");
}
