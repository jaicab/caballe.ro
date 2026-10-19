const fs = require("fs");
const path = require("path");
const privateReview = process.env.PORTFOLIO_PRIVATE_REVIEW === "1";
const sourceDir = privateReview ? "review-src" : "src/site";
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  // A new URL on every CSS change prevents stale browser/CDN styles after release.
  eleventyConfig.addFilter("assetVersion", asset => {
    const bytes = fs.readFileSync(path.join(__dirname, sourceDir, asset));
    const hash = require("crypto").createHash("sha256").update(bytes).digest("hex").slice(0, 12);
    return `${asset}?v=${hash}`;
  });
  if (privateReview) eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.addLayoutAlias("report", "layouts/report.njk");

  eleventyConfig.addPairedShortcode("evidence", function (content) {
    return `</div></div><section class="case-evidence"><div class="u-wrapper">${content}</div></section><div class="u-wrapper"><div class="o-article__content">`;
  });

  eleventyConfig.addPairedShortcode("statement", function (content, label = "Decision") {
    const escape = value => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    return `</div></div><section class="case-statement"><div class="u-wrapper"><p class="case-statement__label">${escape(label)}</p><p class="case-statement__text">${escape(content.trim())}</p></div></section><div class="u-wrapper"><div class="o-article__content">`;
  });

  eleventyConfig.addPairedShortcode("photo", function (
    content,
    color = false,
    caption = "",
    screens = null
  ) {
    return `</div></div>
<div class="u-photo u-whitebreak" ${
      color ? "style='background:" + color + "'" : ""
    }>
<div class="u-wrapper">
${content}
${caption ? "<p>" + caption + "</p>" : ""}
</div>
</div>
<div class="u-wrapper"><div class="o-article__content">
    `;
  });

  eleventyConfig.addPairedShortcode("fullscreen", function (
    content,
    color = false,
    caption = "",
    screens = null
  ) {
    return `</div></div>
<div class="u-photo u-photo--full" ${
      color ? "style='background:" + color + "'" : ""
    }>
${content}
${caption ? "<p>" + caption + "</p>" : ""}
</div>
<div class="u-wrapper"><div class="o-article__content">
    `;
  });

  eleventyConfig.addPairedShortcode("screens", function (
    content,
    color = false,
    caption = "",
    screens = null
  ) {
    return `</div></div>
<div class="u-photo u-photo--screens" ${
      color ? "style='background:" + color + "'" : ""
    }>
${content}
${caption ? "<p>" + caption + "</p>" : ""}
</div>
<div class="u-wrapper"><div class="o-article__content">
    `;
  });

  eleventyConfig.addPairedShortcode("display", function (
    content,
    color = false,
    caption = "",
    screens = null
  ) {
    return `</div></div>
<div class="u-photo u-photo--display" ${
      color ? "style='background:" + color + "'" : ""
    }>
${content}
${caption ? "<p>" + caption + "</p>" : ""}
</div>
<div class="u-wrapper"><div class="o-article__content">
    `;
  });

  eleventyConfig.addPairedShortcode("whitebreak", function (content) {
    return `
</div>
</div>
<div class="u-whitebreak">
<div class="u-wrapper">
<div class="o-article__content">
${content}
</div>
</div>
</div>
<div class="u-wrapper">
<div class="o-article__content">
    `;
  });

  eleventyConfig.addPassthroughCopy(sourceDir + "/css");
  eleventyConfig.addPassthroughCopy(sourceDir + "/downloads");
  eleventyConfig.addPassthroughCopy(sourceDir + "/fonts");
  eleventyConfig.addPassthroughCopy(sourceDir + "/js");
  // Public builds never contain the internal Glass UI or sample exports.
  for (const entry of fs.readdirSync(path.join(__dirname, sourceDir + "/images"))) {
    if (entry !== "case-studies") eleventyConfig.addPassthroughCopy(sourceDir + "/images/" + entry);
  }
  const publicCaseAssets = new Set(["glass", "wise", "checkstep", "moteefe", "dotdot", "carlos-caballero", "caballeros"]);
  for (const entry of fs.readdirSync(path.join(__dirname, sourceDir + "/images/case-studies"))) {
    if (privateReview || publicCaseAssets.has(entry)) {
      eleventyConfig.addPassthroughCopy(sourceDir + "/images/case-studies/" + entry);
    }
  }
  eleventyConfig.addPassthroughCopy(sourceDir + "/favicon.ico");

  eleventyConfig.addPassthroughCopy(sourceDir + "/sitemap.xml");
  eleventyConfig.addPassthroughCopy(sourceDir + "/manifest.json");
  eleventyConfig.addPassthroughCopy(sourceDir + "/browserconfig.xml");

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  return {
    dir: {
      input: sourceDir,
      output: privateReview ? "_review" : "_site",
    },
  };
};
