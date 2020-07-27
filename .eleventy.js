const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addLayoutAlias("report", "layouts/report.njk");


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
