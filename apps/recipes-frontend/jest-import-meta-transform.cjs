const { createTransformer } = require('babel-jest');

const transformer = createTransformer({ presets: ['@nx/react/babel'] });

const replaceImportMeta = (src) => src.replace(/\bimport\.meta\.env\b/g, 'process.env');

module.exports = {
  process(sourceText, sourcePath, transformOptions) {
    return transformer.process(replaceImportMeta(sourceText), sourcePath, transformOptions);
  },
  getCacheKey(sourceText, sourcePath, transformOptions) {
    return transformer.getCacheKey(replaceImportMeta(sourceText), sourcePath, transformOptions);
  },
};
