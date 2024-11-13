"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/rehype-raw";
exports.ids = ["vendor-chunks/rehype-raw"];
exports.modules = {

/***/ "(ssr)/./node_modules/rehype-raw/lib/index.js":
/*!**********************************************!*\
  !*** ./node_modules/rehype-raw/lib/index.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ rehypeRaw)\n/* harmony export */ });\n/* harmony import */ var hast_util_raw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hast-util-raw */ \"(ssr)/./node_modules/hast-util-raw/lib/index.js\");\n/**\n * @typedef {import('hast').Root} Root\n * @typedef {import('hast-util-raw').Options} RawOptions\n * @typedef {import('vfile').VFile} VFile\n */\n\n/**\n * @typedef {Omit<RawOptions, 'file'>} Options\n *   Configuration.\n */\n\n\n\n/**\n * Parse the tree (and raw nodes) again, keeping positional info okay.\n *\n * @param {Options | null | undefined}  [options]\n *   Configuration (optional).\n * @returns\n *   Transform.\n */\nfunction rehypeRaw(options) {\n  /**\n   * @param {Root} tree\n   *   Tree.\n   * @param {VFile} file\n   *   File.\n   * @returns {Root}\n   *   New tree.\n   */\n  return function (tree, file) {\n    // Assume root in -> root out.\n    const result = /** @type {Root} */ ((0,hast_util_raw__WEBPACK_IMPORTED_MODULE_0__.raw)(tree, {...options, file}))\n    return result\n  }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvcmVoeXBlLXJhdy9saWIvaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBLGFBQWEscUJBQXFCO0FBQ2xDLGFBQWEsaUNBQWlDO0FBQzlDLGFBQWEsdUJBQXVCO0FBQ3BDOztBQUVBO0FBQ0EsYUFBYSwwQkFBMEI7QUFDdkM7QUFDQTs7QUFFaUM7O0FBRWpDO0FBQ0E7QUFDQTtBQUNBLFdBQVcsNkJBQTZCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ2U7QUFDZjtBQUNBLGFBQWEsTUFBTTtBQUNuQjtBQUNBLGFBQWEsT0FBTztBQUNwQjtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixNQUFNLElBQUksa0RBQUcsUUFBUSxpQkFBaUI7QUFDcEU7QUFDQTtBQUNBIiwic291cmNlcyI6WyJEOlxcV29ya1xcY29kaW5nLXByYWN0aWNlXFxQcm9qZWN0IFByYWN0aWNlXFxlbnJlY28tY2hhcnRcXG5vZGVfbW9kdWxlc1xccmVoeXBlLXJhd1xcbGliXFxpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJ2hhc3QnKS5Sb290fSBSb290XG4gKiBAdHlwZWRlZiB7aW1wb3J0KCdoYXN0LXV0aWwtcmF3JykuT3B0aW9uc30gUmF3T3B0aW9uc1xuICogQHR5cGVkZWYge2ltcG9ydCgndmZpbGUnKS5WRmlsZX0gVkZpbGVcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPbWl0PFJhd09wdGlvbnMsICdmaWxlJz59IE9wdGlvbnNcbiAqICAgQ29uZmlndXJhdGlvbi5cbiAqL1xuXG5pbXBvcnQge3Jhd30gZnJvbSAnaGFzdC11dGlsLXJhdydcblxuLyoqXG4gKiBQYXJzZSB0aGUgdHJlZSAoYW5kIHJhdyBub2RlcykgYWdhaW4sIGtlZXBpbmcgcG9zaXRpb25hbCBpbmZvIG9rYXkuXG4gKlxuICogQHBhcmFtIHtPcHRpb25zIHwgbnVsbCB8IHVuZGVmaW5lZH0gIFtvcHRpb25zXVxuICogICBDb25maWd1cmF0aW9uIChvcHRpb25hbCkuXG4gKiBAcmV0dXJuc1xuICogICBUcmFuc2Zvcm0uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlaHlwZVJhdyhvcHRpb25zKSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge1Jvb3R9IHRyZWVcbiAgICogICBUcmVlLlxuICAgKiBAcGFyYW0ge1ZGaWxlfSBmaWxlXG4gICAqICAgRmlsZS5cbiAgICogQHJldHVybnMge1Jvb3R9XG4gICAqICAgTmV3IHRyZWUuXG4gICAqL1xuICByZXR1cm4gZnVuY3Rpb24gKHRyZWUsIGZpbGUpIHtcbiAgICAvLyBBc3N1bWUgcm9vdCBpbiAtPiByb290IG91dC5cbiAgICBjb25zdCByZXN1bHQgPSAvKiogQHR5cGUge1Jvb3R9ICovIChyYXcodHJlZSwgey4uLm9wdGlvbnMsIGZpbGV9KSlcbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/rehype-raw/lib/index.js\n");

/***/ })

};
;