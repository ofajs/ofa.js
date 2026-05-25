import { register } from "../register.mjs";
import { render } from "./render.mjs";
import { FakeNode } from "./fake-node.mjs";
import Stanz from "../../stanz/main.mjs";
import { createXEle, eleX, revokeAll } from "../util.mjs";
import { removeArrayValue } from "../public.mjs";
import { getRenderData } from "./condition.mjs";
import { getErr } from "../../ofa-error/main.js";
import { getType } from "../../stanz/public.mjs";

register({
  tag: "x-fill",
  data: {
    value: null,
  },
  watch: {
    value(value, t) {
      this.refreshValue(t?.watchers);
    },
  },
  proto: {
    refreshValue(watchers) {
      const arrayData = this.value;

      if (!this._bindend) {
        return;
      }

      const childs = this._fake.children;

      if (!arrayData) {
        childs.forEach((e) => revokeAll(e));
        this._fake.innerHTML = "";
        return;
      }

      if (!(arrayData instanceof Array)) {
        console.warn(
          getErr("fill_type", {
            type: getType(arrayData),
          })
        );

        childs &&
          childs.forEach((el) => {
            revokeAll(el);
            el.remove();
          });
        return;
      }

      const regData = getRenderData(this._fake);

      if (!regData) {
        return;
      }

      const { data, temps } = regData;

      const targetTemp = temps[this._name];

      const keyName = this.attr("fill-key") || "xid";

      if (!childs.length) {
        const frag = document.createDocumentFragment();

        arrayData.forEach((e, i) => {
          const $ele = createItem(
            e,
            temps,
            targetTemp,
            data.$host || data,
            i,
            keyName
          );
          frag.appendChild($ele.ele);
        });

        this._fake.appendChild(frag);
      } else {
        if (watchers) {
          const isReplaced = watchers.some((e) => e.path.length <= 1);

          if (!isReplaced) {
            // It is not a replacement, it can be corrected by binding the item internally.
            return;
          }
        }

        const vals = arrayData.slice();
        const valsKeys = new Set(
          vals.map((e) => {
            if (!e) {
              return;
            }

            const val = e[keyName];
            return val === undefined ? e : val;
          })
        );

        const { parentNode } = this._fake;

        if (keyName !== "xid" && vals.length !== valsKeys.size) {
          const err = getErr("fill_key_duplicates");
          console.error(err);
          console.warn(err, {
            parentNode,
            host: eleX(parentNode)?.host?.ele,
          });
        }

        // const positionKeys = childs.map((e) => e._data_xid || e);
        // Delete non-existing projects in advance (used to improve performance, this step can be removed and the above comment is turned on)
        const positionKeys = [];
        for (let i = 0, len = childs.length; i < len; i++) {
          const e = childs[i];
          const key = e._data_xid || e;

          if (!valsKeys.has(key)) {
            // If it no longer exists, delete it in advance.
            revokeAll(e);
            e.remove();
            childs.splice(i, 1);
            len--;
            i--;
          } else {
            positionKeys.push(key);
          }
        }

        let target = this._fake._start;

        const needRemoves = [];

        let count = 0;

        while (target) {
          if (target === this._fake) {
            if (vals.length) {
              // We have reached the end, add all elements directly to the front
              vals.forEach((item) => {
                const $ele = createItem(
                  item,
                  temps,
                  targetTemp,
                  data.$host || data,
                  count,
                  keyName
                );

                count++;

                // target.parentNode.insertBefore($ele.ele, target);
                parentNode.insertBefore($ele.ele, target);
              });
            }
            break;
          }
          if (!(target instanceof Element)) {
            target = target.nextSibling;
            continue;
          }
          const currentVal = vals.shift();
          const isObj = currentVal instanceof Object;
          const $tar = eleX(target);
          const item = $tar.__item;

          if (currentVal === undefined && !vals.length) {
            // There will be no follow-up, just delete it directly
            needRemoves.push(target);
            target = target.nextSibling;
            continue;
          }

          const oldId = positionKeys.indexOf(
            isObj ? currentVal[keyName] : currentVal
          );
          if (oldId > -1) {
            // If the key originally exists, perform key displacement.
            const oldItem = childs[oldId];
            if (
              isObj
                ? currentVal[keyName] !== item.$data[keyName]
                : currentVal !== item.$data
            ) {
              // Adjust position
              oldItem.__internal = 1;
              // target.parentNode.insertBefore(oldItem, target);
              parentNode.insertBefore(oldItem, target);
              delete oldItem.__internal;
              target = oldItem;
            }

            // Update object
            const $old = eleX(oldItem);
            if ($old.__item.$data !== currentVal) {
              $old.__item.$data = currentVal;
            }
            $old.__item.$index = count;
          } else {
            // Add new element
            const $ele = createItem(
              currentVal,
              temps,
              targetTemp,
              data.$host || data,
              count,
              keyName
            );

            // target.parentNode.insertBefore($ele.ele, target);
            parentNode.insertBefore($ele.ele, target);
            target = $ele.ele;
          }

          count++;
          target = target.nextSibling;
        }

        if (needRemoves.length) {
          needRemoves.forEach((e) => {
            revokeAll(e);
            e.remove();
          });
        }
      }

      if (this._fake.parentNode) {
        eleX(this._fake.parentNode).refresh();
      }

      this.emit("rendered", {
        bubbles: false,
      });
    },
    init() {
      if (this._bindend) {
        return;
      }

      this._bindend = true;
      const fake = (this._fake = new FakeNode("x-fill"));

      // 搬动 revokes
      fake.__revokes = this.ele.__revokes;

      this.before(fake);
      fake.init();
      this.remove();

      this.refreshValue();
    },
  },
  ready() {
    this._name = this.attr("name");

    if (!this._name) {
      const err = getErr("xhear_fill_tempname", { name: this._name });
      console.warn(err, this.ele);
      throw err;
    }

    if (this.ele._bindingRendered) {
      this.init();
    } else {
      this.one("binding-rendered", () => this.init());
    }
  },
});

export const createItem = ($data, temps, targetTemp, $host, $index, keyName) => {
  const $ele = createXEle(targetTemp.innerHTML);

  const itemData = new Stanz({
    $data,
    // $ele,
    $host,
    $index,
  });

  // tips: 如果$ele被设置为item的子属性，$ele内出现自定义组件，进一步导致改动冒泡，会出现xfill内元素不停渲染的死循环
  Object.defineProperties(itemData, {
    $ele: {
      get() {
        return $ele;
      },
    },
  });

  render({
    target: $ele.ele,
    data: itemData,
    temps,
    // $host,
    isRenderSelf: true,
  });

  const revokes = $ele.ele.__revokes;

  const revoke = () => {
    removeArrayValue(revokes, revoke);
    itemData.revoke();
  };

  revokes.push(revoke);

  $ele.__item = itemData;
  $ele.ele._data_xid = $data?.[keyName] || $data;

  return $ele;
};
