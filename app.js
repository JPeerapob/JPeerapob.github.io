// Renders cv.json (JSON Resume schema) into #cv. All facts live in cv.json.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null) continue;
    if (key === "class") node.className = value;
    else node.setAttribute(key, value);
  }
  for (const child of children.flat()) {
    if (child == null || child === false) continue;
    node.append(child instanceof Node ? child : String(child));
  }
  return node;
}

// "2024-07" -> "Jul 2024", "2022" -> "2022"
function formatDate(iso) {
  const [year, month] = iso.split("-");
  return month ? `${MONTHS[Number(month) - 1]} ${year}` : year;
}

function formatRange(start, end) {
  if (!start) return end ? formatDate(end) : "";
  if (start === end) return formatDate(start);
  return `${formatDate(start)} – ${end ? formatDate(end) : "Present"}`;
}

function displayUrl(url) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

function section(title, ...content) {
  return el("section", { class: "section" }, el("h2", {}, title), ...content);
}

function bullets(items) {
  return items?.length ? el("ul", {}, items.map((text) => el("li", {}, text))) : null;
}

function keywordList(keywords) {
  return keywords?.length ? el("ul", { class: "keywords" }, keywords.map((k) => el("li", {}, k))) : null;
}

function itemHead(title, sub, date) {
  return el("div", { class: "item-head" },
    el("h3", { class: "item-title" }, title, sub ? el("span", { class: "item-sub" }, ` · ${sub}`) : null),
    date ? el("span", { class: "item-date" }, date) : null,
  );
}

function renderHeader(basics) {
  // The email is only assembled here, so it never appears in the HTML source.
  const contact = [];
  if (basics.email) contact.push(el("li", {}, el("a", { href: `mailto:${basics.email}` }, basics.email)));
  for (const profile of basics.profiles ?? []) {
    contact.push(el("li", {}, el("a", { href: profile.url }, displayUrl(profile.url))));
  }
  if (basics.location) contact.push(el("li", {}, [basics.location.city, basics.location.region].filter(Boolean).join(", ")));

  return el("header", { class: "cv-header" },
    el("h1", {}, basics.name),
    el("p", { class: "label" }, basics.label),
    el("ul", { class: "contact" }, contact),
  );
}

function renderCv(cv) {
  const { basics, work = [], projects = [], skills = [], certificates = [], education = [] } = cv;
  const parts = [renderHeader(basics)];

  if (basics.summary) parts.push(section("Summary", el("p", { class: "summary" }, basics.summary)));

  if (work.length) parts.push(section("Experience", work.map((job) =>
    el("article", { class: "item" },
      itemHead(job.position, job.name, formatRange(job.startDate, job.endDate)),
      bullets(job.highlights),
    ),
  )));

  if (projects.length) parts.push(section("Key Projects", projects.map((project) =>
    el("article", { class: "item" },
      itemHead(project.name, [project.entity, ...(project.roles ?? [])].filter(Boolean).join(" · "), formatRange(project.startDate, project.endDate)),
      bullets(project.highlights),
      keywordList(project.keywords),
    ),
  )));

  if (skills.length) parts.push(section("Skills", el("dl", { class: "skills" }, skills.map((skill) =>
    el("div", {}, el("dt", {}, skill.name), el("dd", {}, (skill.keywords ?? []).join(" · "))),
  ))));

  if (certificates.length) parts.push(section("Certifications", el("ul", { class: "plain-list" }, certificates.map((cert) =>
    el("li", {}, cert.name, cert.status === "in-progress" ? el("span", { class: "badge" }, "In progress") : null),
  ))));

  if (education.length) parts.push(section("Education", education.map((edu) =>
    el("article", { class: "item" },
      itemHead([edu.studyType, edu.area].filter(Boolean).join(", "), edu.institution, formatRange(edu.startDate, edu.endDate)),
    ),
  )));

  return parts;
}

async function main() {
  const root = document.getElementById("cv");
  try {
    const response = await fetch("cv.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    root.replaceChildren(...renderCv(await response.json()));
  } catch (error) {
    root.replaceChildren(el("p", { class: "status" }, `Could not load the CV (${error.message}).`));
  }
}

main();
