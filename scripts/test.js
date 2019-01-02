const path = require("path");
const execSync = require("child_process").execSync;

function exec(cmd) {
  execSync(cmd, { stdio: "inherit", env: process.env });
}

const cwd = process.cwd();

// 启动各个package项目的测试
[
  "react-router",
  "react-router-dom",
  "react-router-config",
  "react-router-native"
].forEach(packageName => {
  process.chdir(path.resolve(__dirname, "../packages/" + packageName));
  exec("npm test");
});

process.chdir(cwd);
