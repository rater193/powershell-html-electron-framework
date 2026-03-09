(function patchLiteGraphPromptThemeAware() {

  function getThemeFromRoot(rootEl) {
    const cs = getComputedStyle(rootEl);

    // If you have CSS variables, prefer them (examples shown below)
    const varBg     = cs.getPropertyValue("--app-bg").trim();
    const varPanel  = cs.getPropertyValue("--panel-bg").trim();
    const varBorder = cs.getPropertyValue("--panel-border").trim();
    const varText   = cs.getPropertyValue("--text").trim();
    const varMuted  = cs.getPropertyValue("--text-muted").trim();
    const varInput  = cs.getPropertyValue("--input-bg").trim();
    const varBtn    = cs.getPropertyValue("--btn-bg").trim();
    const varBtn2   = cs.getPropertyValue("--btn-bg-secondary").trim();

    // Fall back to computed background/border colors if vars aren't set
    return {
      overlay: "rgba(0,0,0,0.45)",
      panelBg:  varPanel  || cs.backgroundColor || "#14161a",
      panelBorder: varBorder || "rgba(255,255,255,0.08)",
      text:     varText   || "#e7eaf0",
      muted:    varMuted  || "#cfd6e6",
      inputBg:  varInput  || "rgba(0,0,0,0.25)",
      inputBorder: "rgba(255,255,255,0.10)",
      okBg:     varBtn    || "#1f6feb",
      cancelBg: varBtn2   || "rgba(255,255,255,0.06)",
    };
  }

  function modernPrompt(title, value, callback) {
    const old = document.getElementById("lg-modern-prompt");
    if (old) old.remove();

    const root = document.getElementById("GraphRoot") || document.body;
    const theme = getThemeFromRoot(root);

    const overlay = document.createElement("div");
    overlay.id = "lg-modern-prompt";
    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      background: theme.overlay,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: "999999",
    });

    const box = document.createElement("div");
    Object.assign(box.style, {
      width: "560px",
      maxWidth: "92vw",
      background: theme.panelBg,
      border: `1px solid ${theme.panelBorder}`,
      borderRadius: "12px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    });

    const header = document.createElement("div");
    header.textContent = title || "Edit value";
    Object.assign(header.style, {
      font: "600 13px system-ui, Segoe UI, Arial",
      color: theme.text,
      opacity: "0.95",
    });

    const input = document.createElement("input");
    input.type = "text";
    input.value = value ?? "";
    Object.assign(input.style, {
      width: "100%",
      padding: "11px 12px",
      borderRadius: "10px",
      border: `1px solid ${theme.inputBorder}`,
      background: theme.inputBg,
      color: theme.text,
      font: "13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
      outline: "none",
    });

    const row = document.createElement("div");
    Object.assign(row.style, {
      display: "flex",
      justifyContent: "flex-end",
      gap: "10px",
      marginTop: "2px",
    });

    const btnCancel = document.createElement("button");
    btnCancel.textContent = "Cancel";
    Object.assign(btnCancel.style, {
      padding: "9px 14px",
      borderRadius: "10px",
      border: `1px solid ${theme.panelBorder}`,
      background: theme.cancelBg,
      color: theme.muted,
      cursor: "pointer",
    });

    const btnOk = document.createElement("button");
    btnOk.textContent = "OK";
    Object.assign(btnOk.style, {
      padding: "9px 14px",
      borderRadius: "10px",
      border: `1px solid ${theme.panelBorder}`,
      background: theme.okBg,
      color: "#fff",
      cursor: "pointer",
    });

    function close() {
      overlay.remove();
    }
    function submit() {
      try { callback?.(input.value); }
      finally { close(); }
    }

    btnCancel.onclick = close;
    btnOk.onclick = submit;

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    window.addEventListener("keydown", function onKey(e) {
      if (!document.getElementById("lg-modern-prompt")) {
        window.removeEventListener("keydown", onKey);
        return;
      }
      if (e.key === "Escape") close();
      if (e.key === "Enter") submit();
    });

    row.append(btnCancel, btnOk);
    box.append(header, input, row);
    overlay.append(box);
    document.body.appendChild(overlay);

    input.focus();
    input.select();
  }

  // Patch the common prompt entry points
  if (typeof LiteGraph !== "undefined") {
    LiteGraph.prompt = modernPrompt;
    LiteGraph.createPrompt = modernPrompt;
  }
  if (typeof LGraphCanvas !== "undefined") {
    LGraphCanvas.prototype.prompt = function (title, value, callback) {
      return modernPrompt(title, value, callback);
    };
  }

})();