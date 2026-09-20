// ===== 项目数据 =====
const projects = [
  {
    id: 1,
    title: "在线任务管理系统",
    description: "支持拖拽排序、标签分类和团队协作的任务看板应用。",
    category: "web",
    tags: ["Vue", "Pinia", "Node.js"],
    link: "#",
  },
  {
    id: 2,
    title: "个人博客平台",
    description: "支持 Markdown 编辑、暗色模式和评论功能的博客系统。",
    category: "web",
    tags: ["React", "Express", "MongoDB"],
    link: "#",
  },
  {
    id: 3,
    title: "天气查询小程序",
    description: "基于定位自动获取未来 7 天天气，支持多城市收藏。",
    category: "mini",
    tags: ["微信小程序", "高德 API"],
    link: "#",
  },
  {
    id: 4,
    title: "Markdown 编辑器",
    description: "轻量级所见即所得编辑器，支持实时预览与导出 PDF。",
    category: "tool",
    tags: ["JavaScript", "Vite"],
    link: "#",
  },
  {
    id: 5,
    title: "图片压缩工具",
    description: "纯前端实现的批量图片压缩，本地处理不上传服务器。",
    category: "tool",
    tags: ["Canvas", "Web Worker"],
    link: "#",
  },
  {
    id: 6,
    title: "记账小程序",
    description: "极简记账应用，支持月度统计图表与数据导出。",
    category: "mini",
    tags: ["微信小程序", "ECharts"],
    link: "#",
  },
  {
    id: 7,
    title: "2048 小游戏",
    description: "经典 2048 数字合并游戏，支持键盘与触屏滑动操作。",
    category: "game",
    tags: ["JavaScript", "Canvas"],
    link: "#",
  },
  {
    id: 8,
    title: "贪吃蛇",
    description: "怀旧贪吃蛇游戏，支持难度选择与本地最高分记录。",
    category: "game",
    tags: ["JavaScript", "localStorage"],
    link: "#",
  },
  {
    id: 9,
    title: "记忆翻牌",
    description: "考验记忆力的翻牌配对游戏，支持多种图案主题。",
    category: "game",
    tags: ["JavaScript", "CSS 动画"],
    link: "#",
  },
];

// ===== 渲染项目卡片 =====
const projectsGrid = document.getElementById("projectsGrid");

function renderProjects(filter = "all") {
  const list = filter === "all" ? projects : projects.filter((p) => p.category === filter);
  projectsGrid.innerHTML = list
    .map(
      (p) => `
      <article class="project-card">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="project-tags">
          ${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
        </div>
        <a class="project-link" href="${p.link}">查看详情 →</a>
      </article>`
    )
    .join("");
}

renderProjects();

// ===== 分类筛选 =====
const filterBtns = document.querySelectorAll(".filter-btn");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderProjects(btn.dataset.filter);
  });
});

// ===== 按钮数量显示 =====
function updateCounts() {
  filterBtns.forEach((btn) => {
    const f = btn.dataset.filter;
    const count = f === "all" ? projects.length : projects.filter((p) => p.category === f).length;
    btn.querySelector(".count").textContent = count;
  });
}
updateCounts();

// ===== 移动端导航 =====
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));

navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => navLinks.classList.remove("open"))
);

// ===== 深色模式（三档：auto / light / dark）=====
const themeToggle = document.getElementById("themeToggle");
const themeKey = "theme";
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

const themeIcons = { auto: "🔄", light: "🌙", dark: "☀️" };
const themeTitles = { auto: "当前：跟随系统", light: "当前：浅色模式", dark: "当前：深色模式" };

function effectiveTheme(mode) {
  return mode === "auto" ? (prefersDark.matches ? "dark" : "light") : mode;
}

function applyTheme(mode) {
  document.documentElement.dataset.theme = effectiveTheme(mode);
  themeToggle.textContent = themeIcons[mode];
  themeToggle.title = themeTitles[mode];
  localStorage.setItem(themeKey, mode);
}

// 初始化：优先手动保存值，否则为 auto（跟随系统）
let currentMode = localStorage.getItem(themeKey) || "auto";
applyTheme(currentMode);

// 手动循环切换：auto -> light -> dark -> auto
themeToggle.addEventListener("click", () => {
  const order = ["auto", "light", "dark"];
  currentMode = order[(order.indexOf(currentMode) + 1) % order.length];
  applyTheme(currentMode);
});

// 系统切换时自动跟随（auto 模式下生效）
prefersDark.addEventListener("change", () => {
  if (currentMode === "auto") applyTheme("auto");
});

// ===== 表单校验 =====
const form = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

const validators = {
  name: (v) => (v.trim() ? "" : "请输入姓名"),
  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "请输入有效的邮箱地址",
  message: (v) => (v.trim().length >= 5 ? "" : "留言至少 5 个字符"),
};

function validateField(field) {
  const input = form.elements[field];
  const errorEl = document.getElementById(`${field}Error`);
  const msg = validators[field](input.value);
  errorEl.textContent = msg;
  input.classList.toggle("invalid", !!msg);
  return !msg;
}

Object.keys(validators).forEach((field) => {
  form.elements[field].addEventListener("blur", () => validateField(field));
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const results = Object.keys(validators).map(validateField);
  if (results.every(Boolean)) {
    formSuccess.hidden = false;
    form.reset();
    setTimeout(() => (formSuccess.hidden = true), 3000);
  }
});
