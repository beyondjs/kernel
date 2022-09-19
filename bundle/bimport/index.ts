import {bimport, breload} from "./bimport";
import {brequire} from "./brequire";

/**
 * When running in a BEE, bimport, brequire and breload are implemented by it
 */
(<any>globalThis).breload === void 0 && ((<any>globalThis).breload = breload);
(<any>globalThis).bimport === void 0 && ((<any>globalThis).bimport = bimport);
(<any>globalThis).brequire === void 0 && ((<any>globalThis).brequire = brequire);
