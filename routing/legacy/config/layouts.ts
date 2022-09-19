interface ILayoutConfig {
    name: string,
    bundle: string
}

export class LayoutConfig implements ILayoutConfig {

    readonly #name: string;
    get name() {
        return this.#name;
    }

    readonly #bundle: string;
    get bundle() {
        return this.#bundle;
    }

    constructor(config: ILayoutConfig | undefined) {
        if (!config) {
            this.#name = 'default';
            this.#bundle = '';
            return;
        }

        this.#name = config.name;
        this.#bundle = config.bundle;
    }

}

export class LayoutsConfig {

    #layouts: Record<string, LayoutConfig> = {};

    register(layouts: ILayoutConfig[]) {
        for (const layout of layouts) {
            this.#layouts[layout.name] = new LayoutConfig(layout);
        }
    }

    get(name: string): ILayoutConfig {
        return this.#layouts[name];
    }

    has(name: string): boolean {
        return this.#layouts.hasOwnProperty(name);
    }

}
