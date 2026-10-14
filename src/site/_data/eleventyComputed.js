module.exports = {
  permalink: data => {
    const review = process.env.PORTFOLIO_PRIVATE_REVIEW === '1';
    const input = data.page.inputPath.replace(/^\.\//, '');
    if ((data.restricted || input.endsWith('type-comparison.njk')) && !review) return false;
    const relative = input.replace(review ? /^review-src\// : /^src\/site\//, '');
    if (relative === 'index.njk') return '/';
    if (relative === '404.njk') return '/404.html';
    return '/' + relative.replace(/\.(md|njk|html)$/, '') + '/';
  }
};
