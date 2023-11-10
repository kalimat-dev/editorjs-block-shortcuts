const d = class u {
  constructor({
    editor: e,
    blockConverters: t,
    maxShortcutLength: o
  }) {
    this.editor = e, this.blocks = e.blocks, this.blockConverters = t, this.maxShortcutLength = o ?? 10, this.addListeners();
  }
  addListeners() {
    document.querySelector(".codex-editor__redactor").addEventListener("keyup", (t) => {
      if (t.code === "Space") {
        const o = this.blocks.getCurrentBlockIndex(), n = this.blocks.getBlockByIndex(o), m = n.holder.innerText, i = this.getCaretPosition();
        if (i > this.maxShortcutLength)
          return;
        const s = m.substr(0, i - 1).trim();
        if (u.SPACES_REGEX.test(s))
          return;
        const a = this.getConverterInfoByShortcut(n.name, s);
        a && (document.activeElement.innerHTML = document.activeElement.innerHTML.replace(s, "").replace(/(&nbsp;| )/, ""), (async () => {
          const l = await n.save(), r = a.converter(
            s,
            n.name,
            document.activeElement.innerHTML,
            l
          );
          (a.blockTypeComparator || this.defaultBlockTypeComparator)(
            r.type,
            n.name,
            l.data,
            r.data
          ) && (this.blocks.delete(o), this.blocks.insert(
            r.type,
            r.data,
            r.config,
            o,
            !0
          ), this.editor.caret.setToBlock(o));
        })());
      }
    });
  }
  getConverterInfoByShortcut(e, t) {
    return this.blockConverters.find((o) => o.shortcuts.some((c) => c instanceof RegExp && c.test(t) ? !0 : c == t) ? o.enabledFor ? o.enabledFor.includes(e) : !0 : !1);
  }
  getCaretPosition() {
    document.execCommand("insertHTML", !1, '<a id="hidden">&#x200e</a>');
    const e = document.getElementById("hidden");
    if (!e)
      return 0;
    const t = e.parentElement.innerText.indexOf("‎");
    return e.parentNode.removeChild(e), t;
  }
  defaultBlockTypeComparator(e, t) {
    return e != t;
  }
};
d.SPACES_REGEX = /^\s+$/;
let k = d;
export {
  k as BlockShortcuts
};
