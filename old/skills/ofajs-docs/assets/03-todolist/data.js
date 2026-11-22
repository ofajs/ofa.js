export const todos = $.stanz(
  JSON.parse(localStorage.getItem("ofa-todolist-demo") || "[]"),
);

const wid = todos.watchTick(() => {
  localStorage.setItem("ofa-todolist-demo", JSON.stringify(todos));
}, 500); // 防抖式异步监听，每500ms保存一次

// const wid = todos.watch(); // 同步监听数据变化

// todos.unwatch(wid); // 取消监听
