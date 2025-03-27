import {PageManager} from "../../layout-manager/pages/page-manager/page-manager";
import {Route} from "../../../uri/route";
import type {QueryString} from "../../../uri/querystring";

export /*bundle*/
interface PageContainer {
    render(): void;

    show(): Promise<void>;

    hide(): Promise<void>;

    destroy(): void
}

export /*bundle*/
class PageContainer {
    readonly #container: HTMLElement;
    get container(): HTMLElement {
        return this.#container;
    }

    readonly #pageManager: PageManager;

    get route(): Route {
        return this.#pageManager.uri.route;
    }

    get pathname(): string {
        return this.#pageManager.uri.pathname;
    }

    get vdir(): string {
        return this.#pageManager.uri.route.vdir;
    }

    get search(): string {
        return this.#pageManager.uri.search;
    }

    get qs(): QueryString {
        return this.#pageManager.uri.qs;
    }

    get querystring(): QueryString {
        return this.#pageManager.uri.qs;
    }

    constructor(pageManager: PageManager) {
        this.#pageManager = pageManager;

        const element = document.createElement('div');
        const container = pageManager.pagesContainer instanceof HTMLDivElement ?
            pageManager.pagesContainer : pageManager.pagesContainer.current;

        container.appendChild(element);
        this.#container = element;
    }

    destroy() {
        this.#container.remove();
    }
}
