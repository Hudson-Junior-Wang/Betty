const STORAGE_KEY = "dongrun-management-records-v1";

const modules = [
  { id: "dashboard", label: "工作台", mark: "总" },
  { id: "projects", label: "项目建设", mark: "建" },
  { id: "safety", label: "安全环保", mark: "安" },
  { id: "production", label: "生产技术", mark: "产" },
  { id: "assets", label: "设备物资", mark: "设" },
  { id: "contracts", label: "合同档案", mark: "档" },
  { id: "hr", label: "人力资源", mark: "人" },
  { id: "finance", label: "财务管理", mark: "财" },
  { id: "settings", label: "系统设置", mark: "设" },
];

const moduleDetails = {
  projects: {
    title: "项目建设",
    description: "跟踪矿区建设计划、节点、手续和责任落实情况。",
    ledgers: ["建设项目台账", "手续办理台账", "项目进度计划", "问题整改清单"],
  },
  safety: {
    title: "安全环保",
    description: "统一管理隐患排查、整改销号、环保监测和证照预警。",
    ledgers: ["安全检查台账", "隐患整改台账", "环保监测记录", "证照到期预警"],
  },
  production: {
    title: "生产技术",
    description: "沉淀生产方案、技术资料、图纸和采掘计划。",
    ledgers: ["生产计划台账", "技术方案台账", "图纸资料目录", "产量统计记录"],
  },
  assets: {
    title: "设备物资",
    description: "管理设备档案、维保计划、物资入库和领用记录。",
    ledgers: ["设备档案", "检修保养台账", "物资库存台账", "采购与领用记录"],
  },
  contracts: {
    title: "合同档案",
    description: "集中管理合同履约、文件收发、机密资料、档案借阅和归档。",
    ledgers: ["机密档案库", "合同管理台账", "来文登记簿", "发文登记簿", "档案借阅记录"],
  },
  hr: {
    title: "人力资源",
    description: "作为独立一级模块，覆盖人员从入职到离职的全过程。",
    ledgers: ["人员档案", "劳动合同", "证照资质", "培训记录", "考勤管理", "入转调离"],
  },
  finance: {
    title: "财务管理",
    description: "汇总预算、付款、成本和资金计划等关键数据。",
    ledgers: ["预算执行台账", "付款审批台账", "项目成本台账", "资金计划"],
  },
};

const departments = [
  "综合管理部",
  "项目建设部",
  "生产技术部",
  "安全环保部",
  "设备物资部",
  "合同档案部",
  "人力资源部",
  "财务部",
];

const seedRecords = [
  {
    id: "demo-1",
    module: "projects",
    ledger: "建设项目台账",
    code: "JS-2026-001",
    title: "二号矿区井巷施工",
    department: "项目建设部",
    owner: "陶德世",
    status: "进行中",
    date: "2026-09-30",
    notes: "当前为前端演示记录，可编辑或删除。",
    updatedAt: "2026-07-22 10:30",
  },
  {
    id: "demo-2",
    module: "safety",
    ledger: "隐患整改台账",
    code: "AQ-2026-018",
    title: "7月安全检查问题整改",
    department: "安全环保部",
    owner: "衡莉娟",
    status: "待审核",
    date: "2026-07-26",
    notes: "完成整改并留存照片、验收记录后销号。",
    updatedAt: "2026-07-22 14:10",
  },
  {
    id: "demo-3",
    module: "hr",
    ledger: "人员档案",
    code: "DR-0126",
    title: "演示员工",
    department: "人力资源部",
    owner: "综合文员",
    status: "已归档",
    date: "2027-07-31",
    notes: "演示档案，不代表真实员工信息。",
    updatedAt: "2026-07-22 15:20",
  },
  {
    id: "demo-4",
    module: "contracts",
    ledger: "来文登记簿",
    code: "SW-2026-032",
    title: "安全生产主体责任落实通知",
    department: "综合管理部",
    owner: "办公室",
    status: "已完成",
    date: "2026-07-23",
    notes: "已登记并交相关部门办理。",
    updatedAt: "2026-07-22 16:00",
  },
];

const notices = [
  ["证", "采矿许可证续期资料复核", "今日到期，请确认材料是否齐全。"],
  ["安", "安全检查整改", "有 1 项整改记录等待审核销号。"],
  ["人", "新员工档案", "请补充劳动合同与证照资料。"],
];

const state = {
  activeModule: "dashboard",
  activeLedger: "",
  records: loadRecords(),
  ledgerQuery: "",
  editingId: "",
};

const dom = {
  mainNav: document.querySelector("#mainNav"),
  appContent: document.querySelector("#appContent"),
  pageTitle: document.querySelector("#pageTitle"),
  pageEyebrow: document.querySelector("#pageEyebrow"),
  sidebar: document.querySelector("#sidebar"),
  sidebarBackdrop: document.querySelector("#sidebarBackdrop"),
  mobileMenu: document.querySelector("#mobileMenu"),
  todayLabel: document.querySelector("#todayLabel"),
  notificationButton: document.querySelector("#notificationButton"),
  noticeDrawer: document.querySelector("#noticeDrawer"),
  noticeList: document.querySelector("#noticeList"),
  recordModal: document.querySelector("#recordModal"),
  recordForm: document.querySelector("#recordForm"),
  globalSearchButton: document.querySelector("#globalSearchButton"),
  searchModal: document.querySelector("#searchModal"),
  globalSearchInput: document.querySelector("#globalSearchInput"),
  globalSearchResults: document.querySelector("#globalSearchResults"),
  quickAddButton: document.querySelector("#quickAddButton"),
  toast: document.querySelector("#toast"),
};

function loadRecords() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [...seedRecords];
  } catch {
    return [...seedRecords];
  }
}

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.records));
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function nowLabel() {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

function statusClass(status) {
  if (["已完成", "已归档"].includes(status)) return "done";
  if (status === "已逾期") return "late";
  return "";
}

function showToast(message) {
  dom.toast.textContent = message;
  dom.toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => dom.toast.classList.remove("show"), 2200);
}

function renderNavigation() {
  dom.mainNav.innerHTML = modules
    .map(
      (item) => `
        <button class="nav-button ${state.activeModule === item.id ? "active" : ""}" data-module="${item.id}">
          <span class="nav-mark">${item.mark}</span>
          <span>${item.label}</span>
          <span class="nav-arrow">›</span>
        </button>`,
    )
    .join("");
}

function setHeader(eyebrow, title) {
  dom.pageEyebrow.textContent = eyebrow;
  dom.pageTitle.textContent = title;
}

function navigate(moduleId) {
  state.activeModule = moduleId;
  state.activeLedger = "";
  state.ledgerQuery = "";
  closeMobileNav();
  render();
}

function openLedger(moduleId, ledger) {
  state.activeModule = moduleId;
  state.activeLedger = ledger;
  state.ledgerQuery = "";
  render();
}

function render() {
  renderNavigation();
  if (state.activeModule === "dashboard") {
    setHeader("综合管理", "工作台");
    renderDashboard();
    return;
  }
  if (state.activeModule === "settings") {
    setHeader("系统管理", "系统设置");
    renderSettings();
    return;
  }
  const module = moduleDetails[state.activeModule];
  setHeader("业务管理", state.activeLedger || module.title);
  if (state.activeLedger) renderLedger();
  else renderModuleLanding();
}

function renderDashboard() {
  const moduleRecordCount = state.records.length;
  const pendingCount = state.records.filter((record) =>
    ["待审核", "进行中", "已逾期"].includes(record.status),
  ).length;
  const hrCount = state.records.filter((record) => record.module === "hr").length;

  dom.appContent.innerHTML = `
    <section class="dashboard-stack">
      <div class="metric-grid">
        ${metricCard("待办事项", String(Math.max(pendingCount, 8)), "项", "<b>2项</b> 今日到期", "待")}
        ${metricCard("证照到期预警", "3", "项", "<b>30天</b> 内", "证")}
        ${metricCard("人力资源记录", String(Math.max(hrCount, 1)), "条", "人力资源一级板块", "人", true)}
        ${metricCard("台账记录", String(moduleRecordCount), "条", "当前浏览器已保存", "账")}
      </div>

      <div class="main-grid">
        <article class="panel">
          <div class="panel-heading">
            <h2>待办事项</h2>
            <button class="text-button" data-open-ledger="safety|隐患整改台账">查看全部</button>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>事项</th><th>责任部门</th><th>截止时间</th><th>状态</th></tr></thead>
              <tbody>
                ${[
                  ["采矿许可证续期资料复核", "综合管理部", "今日", "待审核"],
                  ["二号矿区排水方案审核", "生产技术部", "7月24日", "进行中"],
                  ["7月安全检查整改销号", "安全环保部", "7月26日", "进行中"],
                  ["新员工入职资料补充", "人力资源部", "—", "待审核"],
                ]
                  .map(
                    ([title, department, date, status]) => `
                      <tr>
                        <td>${title}</td><td>${department}</td>
                        <td class="${date === "今日" ? "urgent" : ""}">${date}</td>
                        <td><span class="status-chip ${statusClass(status)}">${status}</span></td>
                      </tr>`,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </article>

        <article class="panel">
          <div class="panel-heading"><h2>证照到期预警</h2><button class="text-button" data-open-ledger="safety|证照到期预警">查看全部</button></div>
          <div class="warning-list">
            ${[
              ["证", "安全生产许可证", 29, 56],
              ["爆", "爆破作业单位许可证", 54, 72],
              ["环", "环评批复年度复核", 72, 44],
            ]
              .map(
                ([icon, title, days, width]) => `
                  <div class="warning-row">
                    <span class="warning-icon">${icon}</span>
                    <div class="warning-main"><p>${title}</p><div class="progress-track"><span style="width:${width}%"></span></div></div>
                    <strong>${days}<small> 天后到期</small></strong>
                  </div>`,
              )
              .join("")}
          </div>
        </article>
      </div>

      <div class="main-grid lower-grid">
        <article class="panel project-panel">
          <div class="panel-heading"><h2>二号矿区建设进度</h2><button class="text-button" data-open-ledger="projects|项目进度计划">查看全部</button></div>
          <div class="project-total">68<small>%</small></div>
          <div class="timeline">
            ${[
              ["前期手续", "100%", "done"],
              ["场地平整", "82%", "done"],
              ["井巷施工", "55%", "active"],
              ["设备安装", "20%", ""],
            ]
              .map(
                ([name, percent, className]) => `
                  <div class="timeline-step ${className}">
                    <p>${name}</p><span>${className === "done" ? "✓" : ""}</span><strong>${percent}</strong>
                  </div>`,
              )
              .join("")}
          </div>
        </article>

        <article class="panel">
          <div class="panel-heading"><h2>人员概况</h2><button class="text-button" data-open-ledger="hr|人员档案">查看全部</button></div>
          <div class="people-content">
            <div class="people-summary">
              <div><span>在岗</span><strong>126</strong><i class="people-symbol">人</i></div>
              <div><span>请假</span><strong>4</strong><i class="people-symbol">假</i></div>
              <div><span>培训</span><strong>12</strong><i class="people-symbol">训</i></div>
            </div>
            <div class="department-chart">
              <p>各部门在岗人数</p>
              <div class="bars">
                ${[
                  ["采矿部", 32],
                  ["技术部", 24],
                  ["安环部", 18],
                  ["设备部", 16],
                  ["人资部", 14],
                  ["财务部", 10],
                  ["综合部", 12],
                ]
                  .map(
                    ([name, value]) => `
                      <div class="bar-item"><span class="bar-value">${value}</span><span class="bar" style="height:${Math.round((value / 32) * 88)}px"></span><small>${name}</small></div>`,
                  )
                  .join("")}
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>`;
}

function metricCard(title, value, unit, note, mark, green = false) {
  return `
    <article class="metric-card">
      <span class="metric-icon ${green ? "green" : ""}">${mark}</span>
      <div>
        <p>${title}</p>
        <div class="metric-value ${green ? "green" : ""}"><strong>${value}</strong><span>${unit}</span></div>
        <small>${note}</small>
      </div>
    </article>`;
}

function renderModuleLanding() {
  const module = moduleDetails[state.activeModule];
  dom.appContent.innerHTML = `
    <section class="module-page">
      <div class="module-hero">
        <span class="module-hero-icon">${modules.find((item) => item.id === state.activeModule)?.mark || "业"}</span>
        <div><p>业务模块</p><h2>${module.title}</h2><span>${module.description}</span></div>
      </div>
      <div class="module-entry-grid">
        ${module.ledgers
          .map(
            (ledger, index) => `
              <button class="module-entry" data-ledger="${escapeHtml(ledger)}">
                <span>${String(index + 1).padStart(2, "0")}</span>
                <div><strong>${escapeHtml(ledger)}</strong><small>进入台账管理</small></div>
                <i class="entry-arrow">›</i>
              </button>`,
          )
          .join("")}
      </div>
      ${
        state.activeModule === "hr"
          ? `<div class="hr-note"><span>人</span><div><strong>人力资源板块已独立保留</strong><p>后续可以增加薪酬、绩效、招聘等台账，不影响其他模块结构。</p></div></div>`
          : ""
      }
    </section>`;
}

function filteredLedgerRecords() {
  const query = state.ledgerQuery.trim().toLowerCase();
  return state.records.filter((record) => {
    if (record.module !== state.activeModule || record.ledger !== state.activeLedger) return false;
    if (!query) return true;
    return [record.code, record.title, record.department, record.owner, record.status, record.notes]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
}

function renderLedger() {
  const module = moduleDetails[state.activeModule];
  const records = filteredLedgerRecords();
  const rows = records
    .map(
      (record) => `
        <tr>
          <td>${escapeHtml(record.code || "—")}</td>
          <td><strong>${escapeHtml(record.title)}</strong><small>${escapeHtml(record.notes || "暂无备注")}</small></td>
          <td>${escapeHtml(record.department || "—")}</td>
          <td>${escapeHtml(record.owner || "—")}</td>
          <td><span class="status-chip ${statusClass(record.status)}">${escapeHtml(record.status)}</span></td>
          <td>${formatDate(record.date)}</td>
          <td>
            <div class="row-actions">
              <button data-edit="${record.id}">编辑</button>
              <button class="danger" data-delete="${record.id}">删除</button>
            </div>
          </td>
        </tr>`,
    )
    .join("");

  dom.appContent.innerHTML = `
    <section class="ledger-page">
      <div class="ledger-breadcrumb">
        <button data-back-module>← ${module.title}</button><span>/</span><strong>${escapeHtml(state.activeLedger)}</strong>
      </div>
      <div class="ledger-toolbar">
        <div><p>核心管理台账</p><h2>${escapeHtml(state.activeLedger)}</h2><span>数据保存在当前浏览器，可新增、查询、修改和导出。</span></div>
        <div class="toolbar-actions">
          <button class="secondary-button" data-export>导出 CSV</button>
          <button class="primary-button" data-add-record>＋ 新增记录</button>
        </div>
      </div>
      <div class="data-panel">
        <div class="data-filters">
          <label class="search-box"><span>⌕</span><input id="ledgerSearch" value="${escapeHtml(state.ledgerQuery)}" placeholder="搜索编号、事项、部门或负责人" /></label>
          <span class="record-count">共 ${records.length} 条记录</span>
        </div>
        <div class="ledger-table-wrap">
          ${
            rows
              ? `<table class="ledger-table">
                  <thead><tr><th>编号</th><th>事项名称</th><th>责任部门</th><th>负责人</th><th>状态</th><th>日期</th><th>操作</th></tr></thead>
                  <tbody>${rows}</tbody>
                </table>`
              : `<div class="empty-state"><span>账</span><strong>当前台账还没有记录</strong><small>点击“新增记录”开始录入</small></div>`
          }
        </div>
      </div>
    </section>`;

  const searchInput = document.querySelector("#ledgerSearch");
  searchInput?.addEventListener("input", (event) => {
    state.ledgerQuery = event.target.value;
    renderLedger();
    requestAnimationFrame(() => {
      const nextInput = document.querySelector("#ledgerSearch");
      nextInput?.focus();
      nextInput?.setSelectionRange(state.ledgerQuery.length, state.ledgerQuery.length);
    });
  });
}

function renderSettings() {
  dom.appContent.innerHTML = `
    <section class="settings-page">
      <div class="module-hero">
        <span class="module-hero-icon">设</span>
        <div><p>前端设置</p><h2>系统设置</h2><span>当前为单机前端版，以下功能用于演示与数据维护。</span></div>
      </div>
      <div class="settings-grid">
        <article class="settings-card">
          <h2>本地数据备份</h2>
          <p>把当前浏览器中的全部台账导出为 JSON 文件，可用于手工备份。</p>
          <button class="secondary-button" data-backup>导出全部数据</button>
        </article>
        <article class="settings-card">
          <h2>恢复演示数据</h2>
          <p>清除当前浏览器中的录入内容，并恢复系统最初的演示记录。</p>
          <button class="danger-button" data-reset>恢复演示数据</button>
        </article>
        <article class="settings-card">
          <h2>账号与权限</h2>
          <p>GitHub Pages 纯前端版暂不支持正式账号、角色权限和统一登录。</p>
          <button class="secondary-button" data-info="正式权限需要连接后台服务。">了解限制</button>
        </article>
        <article class="settings-card">
          <h2>附件与审批</h2>
          <p>合同、PDF、照片上传和多人审批需要云存储与数据库，当前不上传真实机密文件。</p>
          <button class="secondary-button" data-info="接入后台后可继续开发附件、审批、日志和自动备份。">后续升级</button>
        </article>
      </div>
    </section>`;
}

function openRecordModal(recordId = "") {
  if (state.activeModule === "dashboard" || state.activeModule === "settings") {
    state.activeModule = "projects";
    state.activeLedger = "建设项目台账";
    render();
  }
  if (!state.activeLedger) {
    state.activeLedger = moduleDetails[state.activeModule]?.ledgers?.[0] || "综合台账";
    render();
  }

  const record = state.records.find((item) => item.id === recordId);
  state.editingId = record?.id || "";
  document.querySelector("#modalEyebrow").textContent = state.activeLedger;
  document.querySelector("#modalTitle").textContent = record ? "编辑记录" : "新增记录";
  document.querySelector("#recordId").value = record?.id || "";
  document.querySelector("#recordCode").value = record?.code || "";
  document.querySelector("#recordTitle").value = record?.title || "";
  document.querySelector("#recordOwner").value = record?.owner || "";
  document.querySelector("#recordStatus").value = record?.status || "进行中";
  document.querySelector("#recordDate").value = record?.date || "";
  document.querySelector("#recordNotes").value = record?.notes || "";
  populateDepartmentOptions(record?.department || departments[0]);
  updateFormLabels();
  dom.recordModal.hidden = false;
  document.body.style.overflow = "hidden";
  setTimeout(() => document.querySelector("#recordTitle")?.focus(), 30);
}

function populateDepartmentOptions(selected) {
  const select = document.querySelector("#recordDepartment");
  select.innerHTML = departments
    .map(
      (department) =>
        `<option ${department === selected ? "selected" : ""}>${department}</option>`,
    )
    .join("");
}

function updateFormLabels() {
  const isPeople = state.activeModule === "hr" && state.activeLedger === "人员档案";
  document.querySelector("#codeLabel").textContent = isPeople ? "员工编号" : "编号";
  document.querySelector("#titleLabel").innerHTML = `${isPeople ? "姓名" : "事项名称"}<b>*</b>`;
  document.querySelector("#ownerLabel").textContent = isPeople ? "岗位/负责人" : "负责人";
  document.querySelector("#dateLabel").textContent = isPeople ? "合同到期日期" : "截止日期";
  document.querySelector("#notesLabel").textContent = isPeople ? "证照、培训及备注" : "备注";
}

function closeRecordModal() {
  dom.recordModal.hidden = true;
  state.editingId = "";
  document.body.style.overflow = "";
}

function saveRecord(event) {
  event.preventDefault();
  const record = {
    id: state.editingId || `record-${Date.now()}`,
    module: state.activeModule,
    ledger: state.activeLedger,
    code: document.querySelector("#recordCode").value.trim(),
    title: document.querySelector("#recordTitle").value.trim(),
    department: document.querySelector("#recordDepartment").value,
    owner: document.querySelector("#recordOwner").value.trim(),
    status: document.querySelector("#recordStatus").value,
    date: document.querySelector("#recordDate").value,
    notes: document.querySelector("#recordNotes").value.trim(),
    updatedAt: nowLabel(),
  };
  if (!record.title) return;

  const index = state.records.findIndex((item) => item.id === state.editingId);
  if (index >= 0) state.records[index] = record;
  else state.records.unshift(record);
  saveRecords();
  closeRecordModal();
  renderLedger();
  showToast(index >= 0 ? "记录已更新" : "记录已保存到当前浏览器");
}

function deleteRecord(recordId) {
  const record = state.records.find((item) => item.id === recordId);
  if (!record) return;
  if (!window.confirm(`确定删除“${record.title}”吗？此操作只影响当前浏览器。`)) return;
  state.records = state.records.filter((item) => item.id !== recordId);
  saveRecords();
  renderLedger();
  showToast("记录已删除");
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function exportCurrentLedger() {
  const records = filteredLedgerRecords();
  const rows = [
    ["编号", "事项名称", "责任部门", "负责人", "状态", "日期", "备注", "更新时间"],
    ...records.map((record) => [
      record.code,
      record.title,
      record.department,
      record.owner,
      record.status,
      record.date,
      record.notes,
      record.updatedAt,
    ]),
  ];
  downloadBlob(
    `\ufeff${rows.map((row) => row.map(csvCell).join(",")).join("\n")}`,
    `${state.activeLedger}-${new Date().toISOString().slice(0, 10)}.csv`,
    "text/csv;charset=utf-8",
  );
  showToast(`已导出 ${records.length} 条记录`);
}

function exportBackup() {
  downloadBlob(
    JSON.stringify(
      {
        system: "楚雄东润矿业综合管理系统",
        exportedAt: new Date().toISOString(),
        records: state.records,
      },
      null,
      2,
    ),
    `楚雄东润矿业台账备份-${new Date().toISOString().slice(0, 10)}.json`,
    "application/json;charset=utf-8",
  );
}

function downloadBlob(content, filename, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function openGlobalSearch() {
  dom.searchModal.hidden = false;
  document.body.style.overflow = "hidden";
  dom.globalSearchInput.value = "";
  renderGlobalSearch("");
  setTimeout(() => dom.globalSearchInput.focus(), 30);
}

function closeGlobalSearch() {
  dom.searchModal.hidden = true;
  document.body.style.overflow = "";
}

function renderGlobalSearch(query) {
  const normalized = query.trim().toLowerCase();
  const results = normalized
    ? state.records.filter((record) =>
        [record.code, record.title, record.department, record.owner, record.ledger, record.notes]
          .join(" ")
          .toLowerCase()
          .includes(normalized),
      )
    : state.records.slice(0, 6);

  dom.globalSearchResults.innerHTML = results.length
    ? results
        .map(
          (record) => `
            <button class="search-result" data-search-result="${record.id}">
              <span>
                <strong>${escapeHtml(record.title)}</strong>
                <small>${escapeHtml(moduleDetails[record.module]?.title || "综合管理")} · ${escapeHtml(record.ledger)} · ${escapeHtml(record.code || "无编号")}</small>
              </span>
              <span>›</span>
            </button>`,
        )
        .join("")
    : `<div class="empty-state"><span>⌕</span><strong>没有找到匹配记录</strong><small>换一个关键词再试试</small></div>`;
}

function openSearchResult(recordId) {
  const record = state.records.find((item) => item.id === recordId);
  if (!record) return;
  closeGlobalSearch();
  openLedger(record.module, record.ledger);
  state.ledgerQuery = record.title;
  renderLedger();
}

function openMobileNav() {
  dom.sidebar.classList.add("open");
  dom.sidebarBackdrop.hidden = false;
}

function closeMobileNav() {
  dom.sidebar.classList.remove("open");
  dom.sidebarBackdrop.hidden = true;
}

function initializeNotices() {
  dom.noticeList.innerHTML = notices
    .map(
      ([mark, title, description]) => `
        <article class="notice-item">
          <span>${mark}</span>
          <div><strong>${title}</strong><p>${description}</p></div>
        </article>`,
    )
    .join("");
}

function bindEvents() {
  dom.mainNav.addEventListener("click", (event) => {
    const button = event.target.closest("[data-module]");
    if (button) navigate(button.dataset.module);
  });

  dom.appContent.addEventListener("click", (event) => {
    const ledgerButton = event.target.closest("[data-ledger]");
    if (ledgerButton) openLedger(state.activeModule, ledgerButton.dataset.ledger);

    const dashboardLedger = event.target.closest("[data-open-ledger]");
    if (dashboardLedger) {
      const [moduleId, ledger] = dashboardLedger.dataset.openLedger.split("|");
      openLedger(moduleId, ledger);
    }

    if (event.target.closest("[data-back-module]")) {
      state.activeLedger = "";
      render();
    }
    if (event.target.closest("[data-add-record]")) openRecordModal();
    if (event.target.closest("[data-export]")) exportCurrentLedger();
    if (event.target.closest("[data-backup]")) {
      exportBackup();
      showToast("全部数据已导出");
    }

    const editButton = event.target.closest("[data-edit]");
    if (editButton) openRecordModal(editButton.dataset.edit);
    const deleteButton = event.target.closest("[data-delete]");
    if (deleteButton) deleteRecord(deleteButton.dataset.delete);
    const infoButton = event.target.closest("[data-info]");
    if (infoButton) showToast(infoButton.dataset.info);

    if (event.target.closest("[data-reset]")) {
      if (window.confirm("确定恢复演示数据吗？当前浏览器中自行录入的记录会被清除。")) {
        state.records = [...seedRecords];
        saveRecords();
        renderSettings();
        showToast("已恢复演示数据");
      }
    }
  });

  dom.mobileMenu.addEventListener("click", openMobileNav);
  dom.sidebarBackdrop.addEventListener("click", closeMobileNav);
  dom.notificationButton.addEventListener("click", () => dom.noticeDrawer.classList.add("open"));
  document.querySelector("[data-close-drawer]").addEventListener("click", () => dom.noticeDrawer.classList.remove("open"));
  dom.quickAddButton.addEventListener("click", () => openRecordModal());
  dom.globalSearchButton.addEventListener("click", openGlobalSearch);
  dom.globalSearchInput.addEventListener("input", (event) => renderGlobalSearch(event.target.value));
  dom.globalSearchResults.addEventListener("click", (event) => {
    const result = event.target.closest("[data-search-result]");
    if (result) openSearchResult(result.dataset.searchResult);
  });
  dom.recordForm.addEventListener("submit", saveRecord);
  document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", closeRecordModal));
  document.querySelectorAll("[data-close-search]").forEach((button) => button.addEventListener("click", closeGlobalSearch));
  dom.recordModal.addEventListener("click", (event) => {
    if (event.target === dom.recordModal) closeRecordModal();
  });
  dom.searchModal.addEventListener("click", (event) => {
    if (event.target === dom.searchModal) closeGlobalSearch();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeRecordModal();
      closeGlobalSearch();
      dom.noticeDrawer.classList.remove("open");
      closeMobileNav();
    }
  });
}

function initialize() {
  dom.todayLabel.textContent = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date());
  initializeNotices();
  bindEvents();
  render();
}

initialize();
