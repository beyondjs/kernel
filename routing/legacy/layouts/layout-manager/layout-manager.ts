import {Pages} from "./pages/pages";
import {LayoutLoader} from "./load";
import {PendingPromise, CancellationToken} from "@beyond-js/kernel/core";
import {URI} from "../../uri/uri";
import {RoutingConfig} from "../../config/config";
import {LayoutConfig} from "../../config/layouts";

export class LayoutManager extends LayoutConfig {
    readonly #pages: Pages;
    get pages() {
        return this.#pages;
    }

    readonly #container: HTMLDivElement;
    get container() {
        return this.#container;
    }

    readonly #loader = new LayoutLoader(this);
    load = async () => this.name === 'default' ? null : this.#loader.load();

    get loaded() {
        return this.name === 'default' ? true : this.#loader.loaded;
    }

    get error() {
        return this.name === 'default' ? false : this.#loader.error;
    }

    get layout() {
        return this.name === 'default' ? undefined : this.#loader.layout;
    }

    // If the layout is the "default", then the container of the pages is directly the
    // layout of the container
    get pagesContainer() {
        return this.name === 'default' ? this.#container : this.#loader.pagesContainer;
    }

    #rendered = new PendingPromise;
    rendered = () => this.#rendered.resolve() as void;

    get ready() {
        return this.name === 'default' ? true : this.#rendered;
    }

    #config = {
        timing: 300,
        css: {
            hiding: 'hiding-layout-container',
            hide: 'hide-layout-container',
            showing: 'showing-layout-container',
            show: 'showed-layout-container'
        }
    };

    constructor(name: string, routingConfig: RoutingConfig) {
        super(routingConfig.layouts.has(name) ? routingConfig.layouts.get(name) : undefined);
        if (this.name === 'default') this.rendered();

        this.#pages = new Pages(this, routingConfig);

        const container = 'body > .layouts-container';

        const element = document.createElement('div');
        this.#container = document.querySelector(container).appendChild(element);
    }

    #cancellationToken = new CancellationToken;

    async show(uri: URI) {
        const cancellationTokenId = this.#cancellationToken.reset();

        await this.load();
        if (!this.#cancellationToken.check(cancellationTokenId)) return;
        if (this.error) return;

        await this.ready;
        if (!this.#cancellationToken.check(cancellationTokenId)) return;

        const config = this.#config;
        const container = this.container;

        container.classList.add(config.css.show);

        await new Promise(resolve => setTimeout(resolve, config.timing));
        if (!this.#cancellationToken.check(cancellationTokenId)) return;

        //TODO: @box check it out.
        //container.classList.contains(config.css.show) && container.classList.remove(config.css.show);
        container.classList.contains(config.css.hide) && container.classList.remove(config.css.hide);
        container.classList.add(config.css.show);
        // Layout is undefined if the layout is the "default"
        if (this.layout && typeof this.layout.show === 'function') {
            await this.layout.show();
        }

        await this.#pages.show(uri);
    }

    async hide() {
        const cancellationTokenId = this.#cancellationToken.reset();

        await this.load();
        if (!this.#cancellationToken.check(cancellationTokenId)) return;
        if (this.error) return;

        await this.ready;
        if (!this.#cancellationToken.check(cancellationTokenId)) return;

        const config = this.#config;
        const container = this.container;

        container.classList.contains(config.css.show) && container.classList.remove(config.css.show);
        container.classList.add(config.css.hide);

        // Layout is undefined if the layout is the "default"
        if (this.layout && typeof this.layout.hide === 'function') {
            await this.layout.hide();
        }
    }
}
