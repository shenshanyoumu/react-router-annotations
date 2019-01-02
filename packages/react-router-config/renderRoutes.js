"use strict";

// 引入renderRoutes子模块的方式
require("./warnAboutDeprecatedCJSRequire.js")("renderRoutes");
module.exports = require("./index.js").renderRoutes;
