const path = require("path");

// Node提供的创建子进程的模块，目的是充分利用多CPU核处理能力
const execSync = require("child_process").execSync;

function exec(cmd) {
  execSync(cmd, { stdio: "inherit", env: process.env });
}

const cwd = process.cwd();

// 同步构建各个package目录下的项目
["react-router", "react-router-dom", "react-router-config"].forEach(
  packageName => {
    process.chdir(path.resolve(__dirname, "../packages/" + packageName));
    exec("npm run build");
  }
);

if (!process.argv.includes("--no-website")) {
  process.chdir(path.resolve(__dirname, "../website"));
  exec("npm run build");
}

process.chdir(cwd);
