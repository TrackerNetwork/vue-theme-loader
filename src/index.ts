import { parseComponent, SFCBlock, SFCDescriptor } from 'vue-template-compiler';
import { getOptions } from 'loader-utils';

/**
 * Takes the contents of a Single File Component (SFC) and transforms it
 * into a "descriptor" object. See global.d.ts in the root for that definition.
 */
export const parse = (source: string): SFCDescriptor =>
  parseComponent(source, { pad: false });

/**
 * Given the source of an SFC and a parsed styleblock from an SFC, this method will remove
 * the given style block and return the resulting source.
 *
 * Note that whitespace is preserved for debugging purposes
 */
export const removeStyleBlock = (source: string, styleDescriptor: SFCBlock): string => {
  const isSelfClosing = styleDescriptor.end === undefined;

  const start = source.lastIndexOf('<', styleDescriptor.start - 1);
  const end = isSelfClosing
    ? styleDescriptor.start
    : source.indexOf('>', styleDescriptor.end);
  const lines = source.slice(start, end).split('\n').length;

  return source.substring(0, start)
    + '\n'.repeat(lines > 1 ? lines - 1 : isSelfClosing ? 1 : 0)
    + source.substring(end + 1, source.length);
};

export const addTitleQualifier = (source: string, styleDescriptor: SFCBlock): string => {
  const title = styleDescriptor.attrs.title;
  const isSelfClosing = styleDescriptor.end === undefined;

  const start = source.lastIndexOf('<', styleDescriptor.start - 1);
  const end = isSelfClosing
    ? styleDescriptor.start
    : source.indexOf('>', styleDescriptor.end);

  const qualifiedStyle = `body[data-title="${title}"] { ${source.slice(start, end)} }`;

  return source.substring(0, start)
    + qualifiedStyle
    + source.substring(end + 1, source.length);
};

/**
 * Given the source of an SFC and the name of a theme, this method will remove all
 * style blocks that have a theme attribute specified whose value does not equal the
 * given theme name. It will not remove style blocks without a theme attribute specified.
 */
export const removeOtherThemes = (source: string, build: string): string => {
  const styles: SFCBlock[] = parse(source).styles;

  for (const style of styles) {
    if (style.attrs.title) {
      source = addTitleQualifier(source, style);
    }
    if (style.attrs.builds && style.attrs.builds.split(',').indexOf(build) === -1) {
      return removeOtherThemes(removeStyleBlock(source, style), build);
    }
  }
  return source;
};

/**
 * The possible options to be provided to the loader
 */
export interface LoaderOptions {
  build: string;
}

/**
 * The entry point for the loader. Interested in learning more about writing loaders?
 * See the docs! https://webpack.js.org/development/how-to-write-a-loader/
 *
 * The "this" argument below is a typescript construct. It's a way to define
 * the type of "this" in the context of the given function. The given usage
 * isn't correct to the actual representation of the context, but it satisfies
 * getOptions so that's all I was concerned with.
 */
export default function vueThemeLoader(this: LoaderOptions, source: string) {
  // getOptions from loader-utils must be used to get loader options
  const { build = '' } = getOptions<LoaderOptions>(this) || {};

  return removeOtherThemes(source, build);
}
