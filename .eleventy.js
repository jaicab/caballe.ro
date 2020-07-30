const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addLayoutAlias("report", "layouts/report.njk");

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

  eleventyConfig.addPassthroughCopy("src/site/css");
  eleventyConfig.addPassthroughCopy("src/site/js");
  eleventyConfig.addPassthroughCopy("src/site/images");
  eleventyConfig.addPassthroughCopy("src/site/favicon.ico");

  eleventyConfig.addPassthroughCopy("src/site/sitemap.xml");
  eleventyConfig.addPassthroughCopy("src/site/manifest.json");
  eleventyConfig.addPassthroughCopy("src/site/browserconfig.xml");

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  return {
    dir: {
      input: "src/site",
      output: "_site",
    },
  };
};
