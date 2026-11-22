/**
 * drill 静态测试页专用的零依赖自检 harness。
 *
 * 页面用 test() 注册具名检查项，最后调用 run()；每条检查会实时渲染到
 * 文档中并带上通过/失败徽章——人工打开页面看到的结果，就是自动化
 * 断言的对象。playwright 用例读取 window.__pageTests 与页面渲染的
 * 汇总文字，人和测试跑器看到同一份证据。
 */

const checks = [];

/** 注册一条具名检查项 */
export const test = (name, fn) => {
  checks.push({ name, fn });
};

/** 断言条件为真，否则抛错（错误会渲染到对应检查项下方） */
export const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message || "断言失败 / assertion failed");
  }
};

/** 基于 JSON 的深度相等断言，满足纯数据夹具的比较需要 */
export const assertEqual = (actual, expected, message) => {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);

  assert(
    actualJson === expectedJson,
    message || `期望 ${expectedJson}，实际 ${actualJson} / expected ${expectedJson}, got ${actualJson}`
  );
};

/** 轮询直到 getter() 返回真值；超时抛错（默认 5 秒） */
export const waitFor = async (
  getter,
  message = "等待条件超时 / condition not met in time",
  timeout = 5000
) => {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    if (getter()) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  throw new Error(message);
};

const STYLES = `
  body { font: 15px/1.6 -apple-system, "PingFang SC", "Segoe UI", sans-serif; margin: 32px auto; max-width: 720px; padding: 0 16px; color: #1d1d1f; }
  h1 { font-size: 20px; margin-bottom: 4px; }
  .summary { margin: 0 0 16px; color: #6e6e73; }
  .summary[data-state="passed"] { color: #1a7f37; }
  .summary[data-state="failed"] { color: #c62828; }
  ul { list-style: none; margin: 0; padding: 0; }
  li { display: flex; align-items: baseline; gap: 10px; padding: 8px 0; border-bottom: 1px solid #e8e8ed; flex-wrap: wrap; }
  .badge { flex: none; font-size: 12px; font-weight: 600; padding: 1px 8px; border-radius: 10px; }
  .badge.pending { background: #e8e8ed; color: #6e6e73; }
  .badge.passed { background: #d8f0dd; color: #1a7f37; }
  .badge.failed { background: #fddddd; color: #c62828; }
  .detail { flex-basis: 100%; margin: 4px 0 0; padding: 8px 10px; background: #fff5f5; border-radius: 6px; color: #c62828; font: 12px/1.5 ui-monospace, monospace; white-space: pre-wrap; word-break: break-all; }
`;

/** 向 body 追加渲染区块；不覆盖页面已有内容（如被测的 <l-m> 元素） */
const renderSkeleton = () => {
  const section = document.createElement("section");
  section.className = "page-tests";
  section.innerHTML = `
    <style>${STYLES}</style>
    <h1>${document.title}</h1>
    <p class="summary" data-state="running">运行中 0/${checks.length}… / running</p>
    <ul>
      ${checks
        .map(
          ({ name }, index) => `
        <li data-index="${index}">
          <span class="badge pending">等待</span>
          <span>${name}</span>
          <pre class="detail" hidden></pre>
        </li>`
        )
        .join("")}
    </ul>`;

  document.body.appendChild(section);
};

const renderSummary = (state) => {
  const summary = document.querySelector(".summary");
  summary.textContent =
    state.finished && state.passed === state.total
      ? `${state.passed}/${state.total} 通过 / passed`
      : `运行中 ${state.passed}/${state.total}… / running`;
  summary.dataset.state = !state.finished
    ? "running"
    : state.passed === state.total
    ? "passed"
    : "failed";
};

/** 更新单条检查项的徽章与失败详情 */
const renderCheck = (index, status, detail) => {
  const li = document.querySelector(`li[data-index="${index}"]`);
  const badge = li.querySelector(".badge");
  badge.textContent = status === "passed" ? "通过" : "失败";
  badge.className = `badge ${status}`;

  if (detail) {
    const pre = li.querySelector(".detail");
    pre.hidden = false;
    pre.textContent = detail;
  }
};

/** 顺序执行所有注册的检查项并实时渲染结果 */
export const run = async () => {
  renderSkeleton();

  // playwright 侧通过该全局状态等待完成并读取结果
  const state = (window.__pageTests = {
    total: checks.length,
    passed: 0,
    failures: [],
    finished: false,
  });

  for (const [index, { name, fn }] of checks.entries()) {
    try {
      await fn();
      state.passed++;
      renderCheck(index, "passed");
    } catch (error) {
      const detail = String((error && error.message) || error);
      state.failures.push({ name, detail });
      renderCheck(index, "failed", detail);
    }

    renderSummary(state);
  }

  state.finished = true;
  renderSummary(state);
};
