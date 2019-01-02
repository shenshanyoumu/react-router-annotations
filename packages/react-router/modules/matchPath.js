// 将路径字符串（如/ user /：name）转换为正则表达式 /^\/user(?:\/(?=$))?(?=\/|$)/i
import pathToRegexp from "path-to-regexp";

const cache = {};
const cacheLimit = 10000;
let cacheCount = 0;

/**
 * 
 * @param {*} path URL路径字符串
 * @param {*} options 将路径字符串转化为正则表达式时的配置参数
 */
function compilePath(path, options) {
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
  const pathCache = cache[cacheKey] || (cache[cacheKey] = {});

  // 为了提高编译效率，对之前的编译结果进行缓存
  if (pathCache[path]){
    return pathCache[path];
  } 

  const keys = [];

  // 进行URL路径字符串到正则表达式的编译过程
  const regexp = pathToRegexp(path, keys, options);
  const result = { regexp, keys };

  if (cacheCount < cacheLimit) {
    pathCache[path] = result;
    cacheCount++;
  }

  return result;
}

/**
 * 
 * @param {*} pathname 目标路由路径字符串
 * @param {*} options 应用中的匹配控制和待匹配路径
 */
function matchPath(pathname, options = {}) {
  if (typeof options === "string") {
    options = { path: options };
  }

  // path表示应用程序中的待匹配路径，后面参数控制匹配过程
  const { path, exact = false, strict = false, sensitive = false } = options;

  const paths = [].concat(path);

  return paths.reduce((matched, path) => {
    if (matched) return matched;

    // 将待匹配路径编译为正则表达式
    const { regexp, keys } = compilePath(path, {
      end: exact,
      strict,
      sensitive
    });

    // 利用正则表达式来匹配路由路径字符串
    const match = regexp.exec(pathname);

    // 不匹配则返回
    if (!match) return null;

    // 当路由路径字符串完全匹配path，则说明在应用中routes配置为静态路由
    const [url, ...values] = match;
    const isExact = pathname === url;

    if (exact && !isExact) return null;

    return {
      path, //待匹配的应用路径
      url: path === "/" && url === "" ? "/" : url, // the matched portion of the URL
      isExact, // 判定是否完全匹配

      // 对于动态路由，需要抽取出路径字符串中的键
      params: keys.reduce((memo, key, index) => {
        memo[key.name] = values[index];
        return memo;
      }, {})
    };
  }, null);
}

export default matchPath;


