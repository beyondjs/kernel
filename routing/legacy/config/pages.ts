export interface IPageConfig {
    route: string,
    bundle: string,
    layout: string,
    vdir: string
}

export class PageConfig implements IPageConfig {

    readonly #route: string;
    get route() {
        return this.#route;
    }

    readonly #bundle: string;
    get bundle() {
        return this.#bundle;
    }

    readonly #layout: string;
    get layout() {
        return this.#layout;
    }

    readonly #vdir: string;
    get vdir() {
        return this.#vdir;
    }

    constructor(page: IPageConfig) {
        this.#route = page.route;
        this.#bundle = page.bundle;
        this.#layout = page.layout;
        this.#vdir = page.vdir;
    }

}

export class PagesConfig {

    #pages: Record<string, PageConfig> = {};

    register(pages: IPageConfig[]) {
        for (const page of pages) {
            this.#pages[page.route] = new PageConfig(page);
        }
    }

    get(name: string): IPageConfig {
        return this.#pages[name];
    }

    has(name: string): boolean {
        return this.#pages.hasOwnProperty(name);
    }

}
