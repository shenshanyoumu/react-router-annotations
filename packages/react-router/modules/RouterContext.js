// TODO: Replace with React.createContext once we can assume React 16+
import createContext from "create-react-context";

// 在React 16版本中重写了context对象的生成过程
const createNamedContext = name => {
  const context = createContext();
  context.Provider.displayName = `${name}.Provider`;
  context.Consumer.displayName = `${name}.Consumer`;
  return context;
}

// context对象提供Consumer/Provider属性，比react 15之前版本实现context特性更加容易
const context = createNamedContext('Router');
export default context;
