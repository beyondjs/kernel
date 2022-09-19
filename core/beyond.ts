import {languages} from "./languages";

declare const bimport: (resource: string, version?: number) => Promise<any>;
declare const breload: (resource: string, version?: number) => Promise<any>;

export class Beyond {
    /**
     * @deprecated
     * Use import {languages} from '@beyond-js/kernel/core';
     */
    get languages() {
        return languages;
    }

    /**
     * @deprecated
     * Use bimport instead of beyond.import
     *
     * @param {string} resource
     * @param {number} version
     * @return {Promise<*>}
     */
    async import(resource: string, version: number) {
        return await bimport(resource, version);
    }

    /**
     * @deprecated
     * Use breload instead of beyond.reload
     *
     * @param {string} resource
     * @param {number} version
     * @return {Promise<*>}
     */
    async reload(resource: string, version: number) {
        return await breload(resource, version);
    }
}

export /*bundle*/ const beyond = new Beyond;
(<any>globalThis).beyond = beyond;
