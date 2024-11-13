"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/trough";
exports.ids = ["vendor-chunks/trough"];
exports.modules = {

/***/ "(ssr)/./node_modules/trough/lib/index.js":
/*!******************************************!*\
  !*** ./node_modules/trough/lib/index.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   trough: () => (/* binding */ trough),\n/* harmony export */   wrap: () => (/* binding */ wrap)\n/* harmony export */ });\n// To do: remove `void`s\n// To do: remove `null` from output of our APIs, allow it as user APIs.\n\n/**\n * @typedef {(error?: Error | null | undefined, ...output: Array<any>) => void} Callback\n *   Callback.\n *\n * @typedef {(...input: Array<any>) => any} Middleware\n *   Ware.\n *\n * @typedef Pipeline\n *   Pipeline.\n * @property {Run} run\n *   Run the pipeline.\n * @property {Use} use\n *   Add middleware.\n *\n * @typedef {(...input: Array<any>) => void} Run\n *   Call all middleware.\n *\n *   Calls `done` on completion with either an error or the output of the\n *   last middleware.\n *\n *   > 👉 **Note**: as the length of input defines whether async functions get a\n *   > `next` function,\n *   > it’s recommended to keep `input` at one value normally.\n\n *\n * @typedef {(fn: Middleware) => Pipeline} Use\n *   Add middleware.\n */\n\n/**\n * Create new middleware.\n *\n * @returns {Pipeline}\n *   Pipeline.\n */\nfunction trough() {\n  /** @type {Array<Middleware>} */\n  const fns = []\n  /** @type {Pipeline} */\n  const pipeline = {run, use}\n\n  return pipeline\n\n  /** @type {Run} */\n  function run(...values) {\n    let middlewareIndex = -1\n    /** @type {Callback} */\n    const callback = values.pop()\n\n    if (typeof callback !== 'function') {\n      throw new TypeError('Expected function as last argument, not ' + callback)\n    }\n\n    next(null, ...values)\n\n    /**\n     * Run the next `fn`, or we’re done.\n     *\n     * @param {Error | null | undefined} error\n     * @param {Array<any>} output\n     */\n    function next(error, ...output) {\n      const fn = fns[++middlewareIndex]\n      let index = -1\n\n      if (error) {\n        callback(error)\n        return\n      }\n\n      // Copy non-nullish input into values.\n      while (++index < values.length) {\n        if (output[index] === null || output[index] === undefined) {\n          output[index] = values[index]\n        }\n      }\n\n      // Save the newly created `output` for the next call.\n      values = output\n\n      // Next or done.\n      if (fn) {\n        wrap(fn, next)(...output)\n      } else {\n        callback(null, ...output)\n      }\n    }\n  }\n\n  /** @type {Use} */\n  function use(middelware) {\n    if (typeof middelware !== 'function') {\n      throw new TypeError(\n        'Expected `middelware` to be a function, not ' + middelware\n      )\n    }\n\n    fns.push(middelware)\n    return pipeline\n  }\n}\n\n/**\n * Wrap `middleware` into a uniform interface.\n *\n * You can pass all input to the resulting function.\n * `callback` is then called with the output of `middleware`.\n *\n * If `middleware` accepts more arguments than the later given in input,\n * an extra `done` function is passed to it after that input,\n * which must be called by `middleware`.\n *\n * The first value in `input` is the main input value.\n * All other input values are the rest input values.\n * The values given to `callback` are the input values,\n * merged with every non-nullish output value.\n *\n * * if `middleware` throws an error,\n *   returns a promise that is rejected,\n *   or calls the given `done` function with an error,\n *   `callback` is called with that error\n * * if `middleware` returns a value or returns a promise that is resolved,\n *   that value is the main output value\n * * if `middleware` calls `done`,\n *   all non-nullish values except for the first one (the error) overwrite the\n *   output values\n *\n * @param {Middleware} middleware\n *   Function to wrap.\n * @param {Callback} callback\n *   Callback called with the output of `middleware`.\n * @returns {Run}\n *   Wrapped middleware.\n */\nfunction wrap(middleware, callback) {\n  /** @type {boolean} */\n  let called\n\n  return wrapped\n\n  /**\n   * Call `middleware`.\n   * @this {any}\n   * @param {Array<any>} parameters\n   * @returns {void}\n   */\n  function wrapped(...parameters) {\n    const fnExpectsCallback = middleware.length > parameters.length\n    /** @type {any} */\n    let result\n\n    if (fnExpectsCallback) {\n      parameters.push(done)\n    }\n\n    try {\n      result = middleware.apply(this, parameters)\n    } catch (error) {\n      const exception = /** @type {Error} */ (error)\n\n      // Well, this is quite the pickle.\n      // `middleware` received a callback and called it synchronously, but that\n      // threw an error.\n      // The only thing left to do is to throw the thing instead.\n      if (fnExpectsCallback && called) {\n        throw exception\n      }\n\n      return done(exception)\n    }\n\n    if (!fnExpectsCallback) {\n      if (result && result.then && typeof result.then === 'function') {\n        result.then(then, done)\n      } else if (result instanceof Error) {\n        done(result)\n      } else {\n        then(result)\n      }\n    }\n  }\n\n  /**\n   * Call `callback`, only once.\n   *\n   * @type {Callback}\n   */\n  function done(error, ...output) {\n    if (!called) {\n      called = true\n      callback(error, ...output)\n    }\n  }\n\n  /**\n   * Call `done` with one value.\n   *\n   * @param {any} [value]\n   */\n  function then(value) {\n    done(null, value)\n  }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvdHJvdWdoL2xpYi9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLG1FQUFtRTtBQUNoRjtBQUNBO0FBQ0EsYUFBYSwrQkFBK0I7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLEtBQUs7QUFDbkI7QUFDQSxjQUFjLEtBQUs7QUFDbkI7QUFDQTtBQUNBLGFBQWEsZ0NBQWdDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLDhCQUE4QjtBQUMzQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ087QUFDUCxhQUFhLG1CQUFtQjtBQUNoQztBQUNBLGFBQWEsVUFBVTtBQUN2QixvQkFBb0I7O0FBRXBCOztBQUVBLGFBQWEsS0FBSztBQUNsQjtBQUNBO0FBQ0EsZUFBZSxVQUFVO0FBQ3pCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLDBCQUEwQjtBQUN6QyxlQUFlLFlBQVk7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGFBQWEsS0FBSztBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFlBQVk7QUFDdkI7QUFDQSxXQUFXLFVBQVU7QUFDckI7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNPO0FBQ1AsYUFBYSxTQUFTO0FBQ3RCOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxZQUFZO0FBQ1osYUFBYSxZQUFZO0FBQ3pCLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQSxlQUFlLEtBQUs7QUFDcEI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sbUNBQW1DLE9BQU87O0FBRTFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsiRDpcXFdvcmtcXGNvZGluZy1wcmFjdGljZVxcUHJvamVjdCBQcmFjdGljZVxcZW5yZWNvLWNoYXJ0XFxub2RlX21vZHVsZXNcXHRyb3VnaFxcbGliXFxpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUbyBkbzogcmVtb3ZlIGB2b2lkYHNcbi8vIFRvIGRvOiByZW1vdmUgYG51bGxgIGZyb20gb3V0cHV0IG9mIG91ciBBUElzLCBhbGxvdyBpdCBhcyB1c2VyIEFQSXMuXG5cbi8qKlxuICogQHR5cGVkZWYgeyhlcnJvcj86IEVycm9yIHwgbnVsbCB8IHVuZGVmaW5lZCwgLi4ub3V0cHV0OiBBcnJheTxhbnk+KSA9PiB2b2lkfSBDYWxsYmFja1xuICogICBDYWxsYmFjay5cbiAqXG4gKiBAdHlwZWRlZiB7KC4uLmlucHV0OiBBcnJheTxhbnk+KSA9PiBhbnl9IE1pZGRsZXdhcmVcbiAqICAgV2FyZS5cbiAqXG4gKiBAdHlwZWRlZiBQaXBlbGluZVxuICogICBQaXBlbGluZS5cbiAqIEBwcm9wZXJ0eSB7UnVufSBydW5cbiAqICAgUnVuIHRoZSBwaXBlbGluZS5cbiAqIEBwcm9wZXJ0eSB7VXNlfSB1c2VcbiAqICAgQWRkIG1pZGRsZXdhcmUuXG4gKlxuICogQHR5cGVkZWYgeyguLi5pbnB1dDogQXJyYXk8YW55PikgPT4gdm9pZH0gUnVuXG4gKiAgIENhbGwgYWxsIG1pZGRsZXdhcmUuXG4gKlxuICogICBDYWxscyBgZG9uZWAgb24gY29tcGxldGlvbiB3aXRoIGVpdGhlciBhbiBlcnJvciBvciB0aGUgb3V0cHV0IG9mIHRoZVxuICogICBsYXN0IG1pZGRsZXdhcmUuXG4gKlxuICogICA+IPCfkYkgKipOb3RlKio6IGFzIHRoZSBsZW5ndGggb2YgaW5wdXQgZGVmaW5lcyB3aGV0aGVyIGFzeW5jIGZ1bmN0aW9ucyBnZXQgYVxuICogICA+IGBuZXh0YCBmdW5jdGlvbixcbiAqICAgPiBpdOKAmXMgcmVjb21tZW5kZWQgdG8ga2VlcCBgaW5wdXRgIGF0IG9uZSB2YWx1ZSBub3JtYWxseS5cblxuICpcbiAqIEB0eXBlZGVmIHsoZm46IE1pZGRsZXdhcmUpID0+IFBpcGVsaW5lfSBVc2VcbiAqICAgQWRkIG1pZGRsZXdhcmUuXG4gKi9cblxuLyoqXG4gKiBDcmVhdGUgbmV3IG1pZGRsZXdhcmUuXG4gKlxuICogQHJldHVybnMge1BpcGVsaW5lfVxuICogICBQaXBlbGluZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyb3VnaCgpIHtcbiAgLyoqIEB0eXBlIHtBcnJheTxNaWRkbGV3YXJlPn0gKi9cbiAgY29uc3QgZm5zID0gW11cbiAgLyoqIEB0eXBlIHtQaXBlbGluZX0gKi9cbiAgY29uc3QgcGlwZWxpbmUgPSB7cnVuLCB1c2V9XG5cbiAgcmV0dXJuIHBpcGVsaW5lXG5cbiAgLyoqIEB0eXBlIHtSdW59ICovXG4gIGZ1bmN0aW9uIHJ1biguLi52YWx1ZXMpIHtcbiAgICBsZXQgbWlkZGxld2FyZUluZGV4ID0gLTFcbiAgICAvKiogQHR5cGUge0NhbGxiYWNrfSAqL1xuICAgIGNvbnN0IGNhbGxiYWNrID0gdmFsdWVzLnBvcCgpXG5cbiAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBmdW5jdGlvbiBhcyBsYXN0IGFyZ3VtZW50LCBub3QgJyArIGNhbGxiYWNrKVxuICAgIH1cblxuICAgIG5leHQobnVsbCwgLi4udmFsdWVzKVxuXG4gICAgLyoqXG4gICAgICogUnVuIHRoZSBuZXh0IGBmbmAsIG9yIHdl4oCZcmUgZG9uZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RXJyb3IgfCBudWxsIHwgdW5kZWZpbmVkfSBlcnJvclxuICAgICAqIEBwYXJhbSB7QXJyYXk8YW55Pn0gb3V0cHV0XG4gICAgICovXG4gICAgZnVuY3Rpb24gbmV4dChlcnJvciwgLi4ub3V0cHV0KSB7XG4gICAgICBjb25zdCBmbiA9IGZuc1srK21pZGRsZXdhcmVJbmRleF1cbiAgICAgIGxldCBpbmRleCA9IC0xXG5cbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhlcnJvcilcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIC8vIENvcHkgbm9uLW51bGxpc2ggaW5wdXQgaW50byB2YWx1ZXMuXG4gICAgICB3aGlsZSAoKytpbmRleCA8IHZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKG91dHB1dFtpbmRleF0gPT09IG51bGwgfHwgb3V0cHV0W2luZGV4XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgb3V0cHV0W2luZGV4XSA9IHZhbHVlc1tpbmRleF1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBTYXZlIHRoZSBuZXdseSBjcmVhdGVkIGBvdXRwdXRgIGZvciB0aGUgbmV4dCBjYWxsLlxuICAgICAgdmFsdWVzID0gb3V0cHV0XG5cbiAgICAgIC8vIE5leHQgb3IgZG9uZS5cbiAgICAgIGlmIChmbikge1xuICAgICAgICB3cmFwKGZuLCBuZXh0KSguLi5vdXRwdXQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayhudWxsLCAuLi5vdXRwdXQpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEB0eXBlIHtVc2V9ICovXG4gIGZ1bmN0aW9uIHVzZShtaWRkZWx3YXJlKSB7XG4gICAgaWYgKHR5cGVvZiBtaWRkZWx3YXJlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAnRXhwZWN0ZWQgYG1pZGRlbHdhcmVgIHRvIGJlIGEgZnVuY3Rpb24sIG5vdCAnICsgbWlkZGVsd2FyZVxuICAgICAgKVxuICAgIH1cblxuICAgIGZucy5wdXNoKG1pZGRlbHdhcmUpXG4gICAgcmV0dXJuIHBpcGVsaW5lXG4gIH1cbn1cblxuLyoqXG4gKiBXcmFwIGBtaWRkbGV3YXJlYCBpbnRvIGEgdW5pZm9ybSBpbnRlcmZhY2UuXG4gKlxuICogWW91IGNhbiBwYXNzIGFsbCBpbnB1dCB0byB0aGUgcmVzdWx0aW5nIGZ1bmN0aW9uLlxuICogYGNhbGxiYWNrYCBpcyB0aGVuIGNhbGxlZCB3aXRoIHRoZSBvdXRwdXQgb2YgYG1pZGRsZXdhcmVgLlxuICpcbiAqIElmIGBtaWRkbGV3YXJlYCBhY2NlcHRzIG1vcmUgYXJndW1lbnRzIHRoYW4gdGhlIGxhdGVyIGdpdmVuIGluIGlucHV0LFxuICogYW4gZXh0cmEgYGRvbmVgIGZ1bmN0aW9uIGlzIHBhc3NlZCB0byBpdCBhZnRlciB0aGF0IGlucHV0LFxuICogd2hpY2ggbXVzdCBiZSBjYWxsZWQgYnkgYG1pZGRsZXdhcmVgLlxuICpcbiAqIFRoZSBmaXJzdCB2YWx1ZSBpbiBgaW5wdXRgIGlzIHRoZSBtYWluIGlucHV0IHZhbHVlLlxuICogQWxsIG90aGVyIGlucHV0IHZhbHVlcyBhcmUgdGhlIHJlc3QgaW5wdXQgdmFsdWVzLlxuICogVGhlIHZhbHVlcyBnaXZlbiB0byBgY2FsbGJhY2tgIGFyZSB0aGUgaW5wdXQgdmFsdWVzLFxuICogbWVyZ2VkIHdpdGggZXZlcnkgbm9uLW51bGxpc2ggb3V0cHV0IHZhbHVlLlxuICpcbiAqICogaWYgYG1pZGRsZXdhcmVgIHRocm93cyBhbiBlcnJvcixcbiAqICAgcmV0dXJucyBhIHByb21pc2UgdGhhdCBpcyByZWplY3RlZCxcbiAqICAgb3IgY2FsbHMgdGhlIGdpdmVuIGBkb25lYCBmdW5jdGlvbiB3aXRoIGFuIGVycm9yLFxuICogICBgY2FsbGJhY2tgIGlzIGNhbGxlZCB3aXRoIHRoYXQgZXJyb3JcbiAqICogaWYgYG1pZGRsZXdhcmVgIHJldHVybnMgYSB2YWx1ZSBvciByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkLFxuICogICB0aGF0IHZhbHVlIGlzIHRoZSBtYWluIG91dHB1dCB2YWx1ZVxuICogKiBpZiBgbWlkZGxld2FyZWAgY2FsbHMgYGRvbmVgLFxuICogICBhbGwgbm9uLW51bGxpc2ggdmFsdWVzIGV4Y2VwdCBmb3IgdGhlIGZpcnN0IG9uZSAodGhlIGVycm9yKSBvdmVyd3JpdGUgdGhlXG4gKiAgIG91dHB1dCB2YWx1ZXNcbiAqXG4gKiBAcGFyYW0ge01pZGRsZXdhcmV9IG1pZGRsZXdhcmVcbiAqICAgRnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7Q2FsbGJhY2t9IGNhbGxiYWNrXG4gKiAgIENhbGxiYWNrIGNhbGxlZCB3aXRoIHRoZSBvdXRwdXQgb2YgYG1pZGRsZXdhcmVgLlxuICogQHJldHVybnMge1J1bn1cbiAqICAgV3JhcHBlZCBtaWRkbGV3YXJlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gd3JhcChtaWRkbGV3YXJlLCBjYWxsYmFjaykge1xuICAvKiogQHR5cGUge2Jvb2xlYW59ICovXG4gIGxldCBjYWxsZWRcblxuICByZXR1cm4gd3JhcHBlZFxuXG4gIC8qKlxuICAgKiBDYWxsIGBtaWRkbGV3YXJlYC5cbiAgICogQHRoaXMge2FueX1cbiAgICogQHBhcmFtIHtBcnJheTxhbnk+fSBwYXJhbWV0ZXJzXG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgZnVuY3Rpb24gd3JhcHBlZCguLi5wYXJhbWV0ZXJzKSB7XG4gICAgY29uc3QgZm5FeHBlY3RzQ2FsbGJhY2sgPSBtaWRkbGV3YXJlLmxlbmd0aCA+IHBhcmFtZXRlcnMubGVuZ3RoXG4gICAgLyoqIEB0eXBlIHthbnl9ICovXG4gICAgbGV0IHJlc3VsdFxuXG4gICAgaWYgKGZuRXhwZWN0c0NhbGxiYWNrKSB7XG4gICAgICBwYXJhbWV0ZXJzLnB1c2goZG9uZSlcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gbWlkZGxld2FyZS5hcHBseSh0aGlzLCBwYXJhbWV0ZXJzKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zdCBleGNlcHRpb24gPSAvKiogQHR5cGUge0Vycm9yfSAqLyAoZXJyb3IpXG5cbiAgICAgIC8vIFdlbGwsIHRoaXMgaXMgcXVpdGUgdGhlIHBpY2tsZS5cbiAgICAgIC8vIGBtaWRkbGV3YXJlYCByZWNlaXZlZCBhIGNhbGxiYWNrIGFuZCBjYWxsZWQgaXQgc3luY2hyb25vdXNseSwgYnV0IHRoYXRcbiAgICAgIC8vIHRocmV3IGFuIGVycm9yLlxuICAgICAgLy8gVGhlIG9ubHkgdGhpbmcgbGVmdCB0byBkbyBpcyB0byB0aHJvdyB0aGUgdGhpbmcgaW5zdGVhZC5cbiAgICAgIGlmIChmbkV4cGVjdHNDYWxsYmFjayAmJiBjYWxsZWQpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkb25lKGV4Y2VwdGlvbilcbiAgICB9XG5cbiAgICBpZiAoIWZuRXhwZWN0c0NhbGxiYWNrKSB7XG4gICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC50aGVuICYmIHR5cGVvZiByZXN1bHQudGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXN1bHQudGhlbih0aGVuLCBkb25lKVxuICAgICAgfSBlbHNlIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICBkb25lKHJlc3VsdClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoZW4ocmVzdWx0KVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsIGBjYWxsYmFja2AsIG9ubHkgb25jZS5cbiAgICpcbiAgICogQHR5cGUge0NhbGxiYWNrfVxuICAgKi9cbiAgZnVuY3Rpb24gZG9uZShlcnJvciwgLi4ub3V0cHV0KSB7XG4gICAgaWYgKCFjYWxsZWQpIHtcbiAgICAgIGNhbGxlZCA9IHRydWVcbiAgICAgIGNhbGxiYWNrKGVycm9yLCAuLi5vdXRwdXQpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGwgYGRvbmVgIHdpdGggb25lIHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0ge2FueX0gW3ZhbHVlXVxuICAgKi9cbiAgZnVuY3Rpb24gdGhlbih2YWx1ZSkge1xuICAgIGRvbmUobnVsbCwgdmFsdWUpXG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/trough/lib/index.js\n");

/***/ })

};
;