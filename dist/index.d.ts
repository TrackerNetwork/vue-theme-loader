import { SFCBlock, SFCDescriptor } from 'vue-template-compiler';
/**
 * Takes the contents of a Single File Component (SFC) and transforms it
 * into a "descriptor" object. See global.d.ts in the root for that definition.
 */
export declare const parse: (source: string) => SFCDescriptor;
/**
 * Given the source of an SFC and a parsed styleblock from an SFC, this method will remove
 * the given style block and return the resulting source.
 *
 * Note that whitespace is preserved for debugging purposes
 */
export declare const removeStyleBlock: (source: string, styleDescriptor: SFCBlock) => string;
export declare const addTitleQualifier: (source: string, styleDescriptor: SFCBlock) => string;
/**
 * Given the source of an SFC and the name of a build, this method will remove all
 * style blocks that have a build attribute specified whose value does not equal the
 * given build name. It will not remove style blocks without a build attribute specified.
 */
export declare const removeOtherStyles: (source: string, build: string) => string;
/**
 * Given the source of an SFC and the name of a build, this method will remove all
 * style blocks that have a build attribute specified whose value does not equal the
 * given build name. It will not remove style blocks without a build attribute specified.
 */
export declare const addRuntimeQualifiers: (source: string) => string;
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
export default function vueThemeLoader(this: LoaderOptions, source: string): string;
