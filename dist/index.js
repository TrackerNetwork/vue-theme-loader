"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_template_compiler_1 = require("vue-template-compiler");
var loader_utils_1 = require("loader-utils");
/**
 * Takes the contents of a Single File Component (SFC) and transforms it
 * into a "descriptor" object. See global.d.ts in the root for that definition.
 */
exports.parse = function (source) {
    return vue_template_compiler_1.parseComponent(source, { pad: false });
};
/**
 * Given the source of an SFC and a parsed styleblock from an SFC, this method will remove
 * the given style block and return the resulting source.
 *
 * Note that whitespace is preserved for debugging purposes
 */
exports.removeStyleBlock = function (source, styleDescriptor) {
    var isSelfClosing = styleDescriptor.end === undefined;
    var start = source.lastIndexOf('<', styleDescriptor.start - 1);
    var end = isSelfClosing
        ? styleDescriptor.start
        : source.indexOf('>', styleDescriptor.end);
    var lines = source.slice(start, end).split('\n').length;
    return source.substring(0, start)
        + '\n'.repeat(lines > 1 ? lines - 1 : isSelfClosing ? 1 : 0)
        + source.substring(end + 1, source.length);
};
exports.addTitleQualifier = function (source, styleDescriptor) {
    var title = styleDescriptor.attrs.title;
    var isSelfClosing = styleDescriptor.end === undefined;
    var start = source.lastIndexOf('<', styleDescriptor.start - 1);
    var end = isSelfClosing
        ? styleDescriptor.start
        : source.indexOf('>', styleDescriptor.end);
    var style = source.substring(start, end + 1);
    var contentStart = style.indexOf(styleDescriptor.content);
    var contentEnd = contentStart + styleDescriptor.content.length;
    var styleOpenTag = style.substring(0, contentStart).replace(/title=\".*?\"/, '');
    var styleCloseTag = style.substring(contentEnd);
    var qualifiedStyle = styleOpenTag + " #app[data-title=\"" + title + "\"] { " + styleDescriptor.content + " } " + styleCloseTag;
    return source.substring(0, start)
        + qualifiedStyle
        + source.substring(end + 1, source.length);
};
/**
 * Given the source of an SFC and the name of a build, this method will remove all
 * style blocks that have a build attribute specified whose value does not equal the
 * given build name. It will not remove style blocks without a build attribute specified.
 */
exports.removeOtherStyles = function (source, build) {
    var styles = exports.parse(source).styles;
    for (var _i = 0, styles_1 = styles; _i < styles_1.length; _i++) {
        var style = styles_1[_i];
        if (style.attrs.builds && style.attrs.builds.split(',').indexOf(build) === -1) {
            return exports.removeOtherStyles(exports.removeStyleBlock(source, style), build);
        }
    }
    return source;
};
/**
 * Given the source of an SFC and the name of a build, this method will remove all
 * style blocks that have a build attribute specified whose value does not equal the
 * given build name. It will not remove style blocks without a build attribute specified.
 */
exports.addRuntimeQualifiers = function (source) {
    var styles = exports.parse(source).styles;
    for (var _i = 0, styles_2 = styles; _i < styles_2.length; _i++) {
        var style = styles_2[_i];
        if (style.attrs.title) {
            return exports.addRuntimeQualifiers(exports.addTitleQualifier(source, style));
        }
    }
    return source;
};
/**
 * The entry point for the loader. Interested in learning more about writing loaders?
 * See the docs! https://webpack.js.org/development/how-to-write-a-loader/
 *
 * The "this" argument below is a typescript construct. It's a way to define
 * the type of "this" in the context of the given function. The given usage
 * isn't correct to the actual representation of the context, but it satisfies
 * getOptions so that's all I was concerned with.
 */
function vueThemeLoader(source) {
    // getOptions from loader-utils must be used to get loader options
    var _a = (loader_utils_1.getOptions(this) || {}).build, build = _a === void 0 ? '' : _a;
    source = exports.addRuntimeQualifiers(exports.removeOtherStyles(source, build));
}
exports.default = vueThemeLoader;
