// Site build settings. You should never need to edit this file.
import markdownIt from "markdown-it";

export default function (eleventyConfig) {
  const md = markdownIt({ html: true, linkify: true, breaks: true });

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.ignores.add("src/admin/**");

  // Markdown text from the editor -> HTML
  eleventyConfig.addFilter("md", (s) => (s ? md.render(String(s)) : ""));
  eleventyConfig.addFilter("mdInline", (s) => (s ? md.renderInline(String(s)) : ""));

  // Status -> colored pill style
  eleventyConfig.addFilter("pillClass", (status) => {
    const map = {
      "For Sale": "available",
      "Under Construction": "building",
      "Completed": "done",
      "Upcoming": "planning",
      "Sold": "sold",
    };
    return map[status] || "planning";
  });

  // Project type -> which gold line drawing to show when there is no photo
  eleventyConfig.addFilter("drawingFor", (type) => {
    const t = (type || "").toLowerCase();
    if (t.includes("stacked")) return "stacked";
    if (t.includes("duplex") || t.includes("town") || t.includes("multi")) return "duplex";
    if (t.includes("lot") || t.includes("subdiv") || t.includes("land")) return "lots";
    return "house";
  });

  eleventyConfig.addFilter("telHref", (p) => "tel:+1" + String(p || "").replace(/\D/g, "").replace(/^1(?=\d{10}$)/, ""));
  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  // Projects: featured first, then by Order number, then name
  const sortProjects = (list) =>
    [...list].sort((a, b) => {
      const fa = a.data.featured ? 0 : 1, fb = b.data.featured ? 0 : 1;
      if (fa !== fb) return fa - fb;
      const oa = Number(a.data.order ?? 999), ob = Number(b.data.order ?? 999);
      if (oa !== ob) return oa - ob;
      return String(a.data.title).localeCompare(String(b.data.title));
    });

  eleventyConfig.addCollection("projects", (api) =>
    sortProjects(api.getFilteredByGlob("src/projects/*.md").filter((p) => !p.data.hidden))
  );
  eleventyConfig.addCollection("downloads", (api) =>
    api.getFilteredByGlob("src/downloads/*.md").sort((a, b) => Number(a.data.order ?? 999) - Number(b.data.order ?? 999))
  );

  eleventyConfig.addFilter("byStatus", (list, statuses) => {
    if (!statuses || !statuses.length) return list;
    return list.filter((p) => statuses.includes(p.data.status));
  });
  eleventyConfig.addFilter("byCategory", (list, cat) => (!cat ? list : list.filter((d) => d.data.category === cat)));
  eleventyConfig.addFilter("limit", (list, n) => (n ? list.slice(0, Number(n)) : list));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
}
