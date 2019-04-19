/**
 * Simple promise wrapper around node's readFile
 */
export declare const readFile: (file: string) => Promise<string>;
/**
 * Simple promise wrapper around node's writeFile
 */
export declare const writeFile: (file: string, content: string) => Promise<{}>;
