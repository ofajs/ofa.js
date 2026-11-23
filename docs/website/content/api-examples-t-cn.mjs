// 由 scripts/sync-t-cn.mjs 生成，请勿手改。
export const API_EXAMPLES_TCN = {
  "globalBody": {
    "entry": "raw",
    "files": {
      "index.html": "<!doctype html>\n<html lang=\"zh-CN\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>用全局 $ 操作 body</title>\n    <style>\n      body { margin: 0; padding: 28px; font-family: system-ui, sans-serif; color: #111827; }\n      h1 { margin-top: 0; }\n      #target { margin: 16px 0; padding: 12px 14px; border: 1px solid #cbd5e1; border-radius: 8px; }\n      button { padding: 8px 14px; border: 0; border-radius: 8px; background: #0061a4; color: #fff; cursor: pointer; }\n    </style>\n  </head>\n  <body>\n    <h1>用全局 $ 操作 body</h1>\n    <p>這些元素直接寫在 body 裡，沒有 page 模塊，也沒有模板語法。</p>\n    <div id=\"target\">原始內容</div>\n    <button id=\"change\">點我用 $ 修改</button>\n\n    <script\n      type=\"module\"\n      src=\"https://cdn.jsdelivr.net/gh/ofajs/ofa.js@5/dist/ofa.min.mjs\"\n    ></script>\n    <script type=\"module\">\n      const target = $(\"#target\");\n      const change = $(\"#change\");\n\n      change.on(\"click\", () => {\n        target.text = \"全局 $ 選中了 body 上的元素\";\n        target.css = { background: \"#15803d\", color: \"#fff\", padding: \"12px\" };\n      });\n    </script>\n  </body>\n</html>"
    }
  },
  "instance": {
    "entry": "page",
    "files": {
      "page.html": "<template page>\n  <style>\n    :host { display: block; padding: 28px; font-family: system-ui, sans-serif; color: #111827; }\n    h1 { margin-top: 0; }\n    button { margin: 4px 8px 4px 0; padding: 8px 14px; border: 0; border-radius: 8px; background: #0061a4; color: #fff; cursor: pointer; }\n    p { line-height: 1.6; }\n  </style>\n  <h1>實例基礎</h1>\n  <button class=\"demo\" on:click=\"inspect\">檢查這個按鈕</button>\n  <p>{{info}}</p>\n\n  <script>\n    export default {\n      data: { info: \"點擊按鈕，讀取實例屬性\" },\n      proto: {\n        inspect() {\n          const btn = this.shadow.$(\".demo\");\n          this.info = [\n            \"tag=\" + btn.tag,\n            \"index=\" + btn.index,\n            \"xid=\" + btn.xid,\n            \"PATH=\" + (this.PATH || \"\").split(\"/\").pop(),\n          ].join(\" · \");\n          btn.ele.style.outline = \"2px solid #0061a4\";\n        },\n      },\n    };\n  </script>\n</template>"
    }
  },
  "traverse": {
    "entry": "page",
    "files": {
      "page.html": "<template page>\n  <style>\n    :host { display: block; padding: 28px; font-family: system-ui, sans-serif; color: #111827; }\n    h1 { margin-top: 0; }\n    button { margin: 4px 8px 4px 0; padding: 8px 14px; border: 0; border-radius: 8px; background: #0061a4; color: #fff; cursor: pointer; }\n    p { line-height: 1.6; }\n  </style>\n  <h1>選擇與遍歷</h1>\n  <ul id=\"list\">\n    <li>第一項</li>\n    <li>第二項</li>\n    <li>第三項</li>\n  </ul>\n  <button on:click=\"mark\">遍歷並標記</button>\n  <p>{{info}}</p>\n\n  <script>\n    export default {\n      data: { info: \"點擊按鈕查看兄弟節點\" },\n      proto: {\n        mark() {\n          const items = this.shadow.$(\"#list\").all(\"li\");\n          const second = items[1];\n          second.prev.class(\"hit\", true);\n          second.next.class(\"hit\", true);\n          this.info =\n            \"第二項前一個：\" + second.prev.text +\n            \"；後一個：\" + second.next.text;\n        },\n      },\n    };\n  </script>\n  <style>\n    .hit { color: #0061a4; font-weight: 700; }\n  </style>\n</template>"
    }
  },
  "structure": {
    "entry": "page",
    "files": {
      "page.html": "<template page>\n  <style>\n    :host { display: block; padding: 28px; font-family: system-ui, sans-serif; color: #111827; }\n    h1 { margin-top: 0; }\n    button { margin: 4px 8px 4px 0; padding: 8px 14px; border: 0; border-radius: 8px; background: #0061a4; color: #fff; cursor: pointer; }\n    p { line-height: 1.6; }\n  </style>\n  <h1>結構操作</h1>\n  <ul id=\"list\"><li>原有項</li></ul>\n  <button on:click=\"addItem\">新增</button>\n  <button on:click=\"removeFirst\">刪除第一項</button>\n  <button on:click=\"wrapSecond\">包裹第二項</button>\n  <p>{{info}}</p>\n\n  <script>\n    export default {\n      data: { count: 0, info: \"用方法直接操作 DOM\" },\n      proto: {\n        addItem() {\n          this.count += 1;\n          this.shadow.$(\"#list\").push(\"<li>新增項 \" + this.count + \"</li>\");\n          this.info = \"push 後共有 \" + this.shadow.$(\"#list\").length + \" 項\";\n        },\n        removeFirst() {\n          const first = this.shadow.$(\"#list\")[0];\n          if (first) first.remove();\n          this.info = \"remove 後共有 \" + this.shadow.$(\"#list\").length + \" 項\";\n        },\n        wrapSecond() {\n          const second = this.shadow.$(\"#list\")[1];\n          if (!second) return;\n          second.wrap(\"<div class='wrap' style='border:1px dashed #0061a4;padding:6px'></div>\");\n          this.info = \"第二項已被 wrap 包裹\";\n        },\n      },\n    };\n  </script>\n</template>"
    }
  },
  "props": {
    "entry": "page",
    "files": {
      "page.html": "<template page>\n  <style>\n    :host { display: block; padding: 28px; font-family: system-ui, sans-serif; color: #111827; }\n    h1 { margin-top: 0; }\n    button { margin: 4px 8px 4px 0; padding: 8px 14px; border: 0; border-radius: 8px; background: #0061a4; color: #fff; cursor: pointer; }\n    p { line-height: 1.6; }\n  </style>\n  <style>\n    .box { padding: 16px; border: 1px solid #cbd5e1; border-radius: 10px; }\n    .box.active { box-shadow: 0 0 0 2px #0061a4; }\n  </style>\n\n  <h1>內容、屬性與樣式</h1>\n  <div id=\"box\" class=\"box\">原始內容</div>\n  <button on:click=\"apply\">更新內容與樣式</button>\n  <p>{{info}}</p>\n\n  <script>\n    export default {\n      data: { info: \"等待操作\" },\n      proto: {\n        apply() {\n          const box = this.shadow.$(\"#box\");\n          box.text = \"文本被 el.text 改寫了\";\n          box.attr(\"data-state\", \"done\");\n          box.css = { background: \"#e8f1fb\", borderColor: \"#0061a4\" };\n          box.class(\"active\", true);\n          this.info =\n            \"data-state=\" + box.attr(\"data-state\") +\n            \"，class 已加：\" + box.class(\"active\");\n        },\n      },\n    };\n  </script>\n</template>"
    }
  },
  "events": {
    "entry": "page",
    "files": {
      "page.html": "<template page>\n  <style>\n    :host { display: block; padding: 28px; font-family: system-ui, sans-serif; color: #111827; }\n    h1 { margin-top: 0; }\n    button { margin: 4px 8px 4px 0; padding: 8px 14px; border: 0; border-radius: 8px; background: #0061a4; color: #fff; cursor: pointer; }\n    p { line-height: 1.6; }\n  </style>\n  <h1>事件</h1>\n  <button id=\"btn\" on:click=\"fire\">發自定義事件</button>\n  <p>{{log}}</p>\n\n  <script>\n    export default {\n      data: { count: 0, log: \"等待事件\" },\n      attached() {\n        this._handler = (event) => {\n          this.log = \"收到事件：n=\" + event.data.n;\n        };\n        this.shadow.$(\"#btn\").on(\"custom\", this._handler);\n      },\n      detached() {\n        this.shadow.$(\"#btn\").off(\"custom\", this._handler);\n      },\n      proto: {\n        fire() {\n          this.count += 1;\n          this.shadow.$(\"#btn\").emit(\"custom\", {\n            data: { n: this.count },\n            bubbles: true,\n          });\n        },\n      },\n    };\n  </script>\n</template>"
    }
  },
  "reactive": {
    "entry": "page",
    "files": {
      "page.html": "<template page>\n  <style>\n    :host { display: block; padding: 28px; font-family: system-ui, sans-serif; color: #111827; }\n    h1 { margin-top: 0; }\n    button { margin: 4px 8px 4px 0; padding: 8px 14px; border: 0; border-radius: 8px; background: #0061a4; color: #fff; cursor: pointer; }\n    p { line-height: 1.6; }\n  </style>\n  <h1>數據與偵聽</h1>\n  <p>計數：<strong>{{count}}</strong></p>\n  <button on:click=\"bump\">+1</button>\n  <p>{{log}}</p>\n\n  <script>\n    export default {\n      data: { count: 0, log: \"等待變更\" },\n      attached() {\n        this._tid = this.watch(() => {\n          this.log = \"watch 看到 count=\" + this.count;\n        });\n      },\n      detached() {\n        if (this._tid != null) this.unwatch(this._tid);\n      },\n      proto: {\n        bump() {\n          this.count += 1;\n        },\n      },\n    };\n  </script>\n</template>"
    }
  },
  "app": {
    "entry": "app",
    "files": {
      "home.html": "<template page>\n  <style>\n    :host { display:block; padding:28px; font-family:system-ui,sans-serif; color:#111827; }\n    h1 { margin-top:0; }\n    a { color:#0061a4; }\n    button { margin-top:12px; padding:8px 14px; border:0; border-radius:8px; background:#0061a4; color:#fff; cursor:pointer; }\n  </style>\n  <h1>o-app 實例</h1>\n  <p>當前頁面：{{pageFile}}</p>\n  <p><a olink href=\"./about.html?from=home\">用 olink 去關於頁</a></p>\n  <button on:click=\"go\">用 page.goto 跳轉</button>\n\n  <script>\n    export default {\n      data: { pageFile: \"\" },\n      ready() {\n        this.pageFile = this.src.split(\"/\").pop();\n      },\n      proto: {\n        go() {\n          this.goto(\"./about.html?from=page-goto\");\n        },\n      },\n    };\n  </script>\n</template>",
      "app.mjs": "export const home = \"./home.html\";",
      "about.html": "<template page>\n  <style>\n    :host { display:block; padding:28px; font-family:system-ui,sans-serif; color:#111827; }\n    h1 { margin-top:0; }\n    button { margin-top:12px; padding:8px 14px; border:0; border-radius:8px; background:#0061a4; color:#fff; cursor:pointer; }\n  </style>\n  <h1>關於頁</h1>\n  <p>來源參數：{{from}}</p>\n  <p>應用當前頁：{{appFile}}</p>\n  <button on:click=\"back\">返回上一頁</button>\n\n  <script>\n    export default async ({ query }) => ({\n      data: { from: query.from || \"直接訪問\", appFile: \"\" },\n      ready() {\n        this.appFile = this.app.current.src.split(\"/\").pop();\n      },\n    });\n  </script>\n</template>"
    }
  },
  "context": {
    "entry": "page",
    "files": {
      "page.html": "<template page>\n  <style>\n    :host { display:block; padding:28px; font-family:system-ui,sans-serif; color:#111827; }\n    h1 { margin-top:0; }\n    button { margin-top:12px; padding:8px 14px; border:0; border-radius:8px; background:#0061a4; color:#fff; cursor:pointer; }\n    user-badge { display:block; margin:8px 0; }\n  </style>\n\n  <h1>上下文通信</h1>\n  <l-m src=\"./user-badge.html\"></l-m>\n\n  <o-provider id=\"team\" name=\"team\" team-name=\"前端組\" team-lead=\"Yao\">\n    <user-badge></user-badge>\n    <user-badge></user-badge>\n  </o-provider>\n\n  <button on:click=\"rename\">切換團隊</button>\n\n  <script>\n    export default {\n      data: { alternate: false },\n      proto: {\n        rename() {\n          const provider = this.shadow.$(\"#team\");\n          this.alternate = !this.alternate;\n          provider.teamName = this.alternate ? \"設計組\" : \"前端組\";\n          provider.teamLead = this.alternate ? \"Ada\" : \"Yao\";\n        },\n      },\n    };\n  </script>\n</template>",
      "user-badge.html": "<template component>\n  <style>\n    :host { display:block; font-family:system-ui,sans-serif; }\n    .badge { display:flex; gap:10px; padding:10px 14px; border:1px solid #dbe3ef; border-radius:10px; }\n    strong { color:#111827; }\n    span { color:#64748b; }\n  </style>\n  <div class=\"badge\"><strong>{{name}}</strong><span>負責人：{{lead}}</span></div>\n  <o-consumer\n    name=\"team\"\n    watch:team-name=\"name\"\n    watch:team-lead=\"lead\"\n  ></o-consumer>\n  <script>\n    export default {\n      tag: \"user-badge\",\n      data: { name: \"未分組\", lead: \"—\" },\n    };\n  </script>\n</template>"
    }
  },
  "global": {
    "entry": "page",
    "files": {
      "page.html": "<template page>\n  <style>\n    :host { display: block; padding: 28px; font-family: system-ui, sans-serif; color: #111827; }\n    h1 { margin-top: 0; }\n    button { margin: 4px 8px 4px 0; padding: 8px 14px; border: 0; border-radius: 8px; background: #0061a4; color: #fff; cursor: pointer; }\n    p { line-height: 1.6; }\n  </style>\n\n  <h1>全局 $ 靜態成員</h1>\n  <p>版本：{{version}}</p>\n  <p>{{info}}</p>\n  <button on:click=\"inspect\">讀取 $.all / $.Stanz</button>\n  <button on:click=\"tick\">$.nextTick</button>\n  <ul><li>列表項 A</li><li>列表項 B</li></ul>\n\n  <script>\n    export default {\n      data: {\n        version: $.version,\n        info: \"點擊按鈕讀取全局成員\",\n      },\n      proto: {\n        inspect() {\n          const items = $.all(\"li\");\n          this.info =\n            \"$.all('li') 找到 \" + items.length + \" 項；\" +\n            \"$.Stanz 類型：\" + typeof $.Stanz;\n        },\n        tick() {\n          $.nextTick(() => {\n            this.info = \"$.nextTick 回調已執行\";\n          });\n        },\n      },\n    };\n  </script>\n</template>"
    }
  },
  "extend": {
    "entry": "page",
    "files": {
      "page.html": "<template page>\n  <style>\n    :host { display: block; padding: 28px; font-family: system-ui, sans-serif; color: #111827; }\n    h1 { margin-top: 0; }\n    button { margin: 4px 8px 4px 0; padding: 8px 14px; border: 0; border-radius: 8px; background: #0061a4; color: #fff; cursor: pointer; }\n    p { line-height: 1.6; }\n  </style>\n  <h1>擴展實例</h1>\n  <button id=\"btn\" on:click=\"useCustom\">調用擴展方法</button>\n  <p>{{info}}</p>\n\n  <script>\n    export default {\n      data: { info: \"等待調用\" },\n      ready() {\n        this.shadow.$(\"#btn\").extend({\n          mark(text) {\n            this.attr(\"data-mark\", text);\n            return \"實例擴展方法被調用\";\n          },\n        });\n        $.fn.extend({\n          get demoCount() {\n            return $.all(\"*\").length;\n          },\n        });\n      },\n      proto: {\n        useCustom() {\n          const btn = this.shadow.$(\"#btn\");\n          this.info = btn.mark(\"done\") + \"；全局實例數：\" + btn.demoCount;\n        },\n      },\n    };\n  </script>\n</template>"
    }
  }
};
