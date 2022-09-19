declare const beyond: any;

export interface IModuleSpecs {
    vspecifier: string,
    multibundle?: boolean
}

export /*bundle*/
class Module {
    readonly #pkg: string;
    get pkg() {
        return this.#pkg;
    }

    readonly #vspecifier: string;
    get vspecifier() {
        return this.#vspecifier;
    }

    readonly #specifier: string;
    get specifier() {
        return this.#specifier;
    }

    readonly #version: string;
    get version() {
        return this.#version;
    }

    readonly #subpath: string;
    get subpath() {
        return this.#subpath;
    }

    readonly #multibundle: boolean;
    get multibundle() {
        return this.#multibundle;
    }

    constructor(specs: IModuleSpecs) {
        this.#vspecifier = specs.vspecifier;
        this.#multibundle = specs.multibundle;

        const split = specs.vspecifier.split('/');
        const scope = split[0].startsWith('@') ? split.shift() : void 0;
        const [name, version] = split.shift().split('@');

        this.#subpath = split.join('/');
        this.#pkg = scope ? `${scope}/${name}` : name;
        this.#version = version;
        this.#specifier = this.#pkg + (this.#subpath ? `/${this.#subpath}` : '');
    }

    /**
     * @deprecated
     *
     * @param {string} action
     * @param {Record<string, *>} params
     * @return {Promise<*>}
     */
    async execute(action: string, params: Record<string, any>) {
        if (typeof (<any>globalThis).beyond !== 'object') return;

        const {backends} = await beyond.import('@beyond-js/backend/client');
        return await backends.execute(this.#pkg, 'legacy', this.#subpath, action, params);
    }
}
