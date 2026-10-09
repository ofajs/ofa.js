export default (async () => {
  const packagesUrl = import.meta.url.replace(/(.+)\/.+/, "$1");

  // 初始化逻辑
  lm.config({
    alias: {
      "@ofa": `${packagesUrl}`,
    },
  });
})();
