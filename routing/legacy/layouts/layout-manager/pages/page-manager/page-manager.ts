import {CancellationToken} from "@beyond-js/kernel/core";
import {URI} from "../../../../uri/uri";
import {PageLoader} from "./loader";
import {IPageConfig, PageConfig} from "../../../../config/pages";
import type React from "react";

type LayoutContainer = React.RefObject<HTMLDivElement> | HTMLDivElement;

export class PageManager extends PageConfig {
    readonly #pagesContainer: LayoutContainer;
    get pagesContainer() {
        return this.#pagesContainer;
    }

    readonly #loader = new PageLoader(this);
    load = async () => this.#loader.load();

    #uri: URI;
    get uri() {
        return this.#uri;
    }

    get error() {
        return this.#loader.error;
    }

    get page() {
        return this.#loader.page;
    }

    constructor(uri: URI, config: IPageConfig, pagesContainer: LayoutContainer) {
        super(config);
        this.#pagesContainer = pagesContainer;
        this.#uri = uri;
    }

    #cancellationToken = new CancellationToken;

    async show() {
        const cancellationTokenId = this.#cancellationToken.reset();
        await this.#loader.load();
        if (!this.#cancellationToken.check(cancellationTokenId)) return;
        if (this.error) return;

        this.page.container.style.display = '';
        typeof this.page.show === 'function' && await this.page.show();
    }

    async hide() {
        const cancellationTokenId = this.#cancellationToken.reset();
        await this.#loader.load();
        if (!this.#cancellationToken.check(cancellationTokenId)) return;
        if (this.error) return;

        this.page.container.style.display = 'none';
        typeof this.page.hide === 'function' && await this.page.hide();
    }
}
