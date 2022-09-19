import {LayoutManager} from "../layout-manager";
import {URI} from "../../../uri/uri";
import {RoutingConfig} from "../../../config/config";
import {PageManager} from "./page-manager/page-manager";
import {CancellationToken} from "@beyond-js/kernel/core";

export class Pages {
    readonly #layoutManager: LayoutManager;
    readonly #routingConfig: RoutingConfig;

    #instances: Map<string, PageManager> = new Map;

    #active: PageManager;
    get active() {
        return this.#active;
    }

    constructor(layout: LayoutManager, routingConfig: RoutingConfig) {
        this.#layoutManager = layout;
        this.#routingConfig = routingConfig;
    }

    // Avoid to continue the execution on asynchronous calls, when a newest call's been made
    #cancellationToken = new CancellationToken;

    async show(uri: URI) {
        const currentCancellationToken = this.#cancellationToken.reset();

        if (this.#active && uri.pathname === this.#active.uri.pathname) return;

        const route = uri.route.route;
        if (!route) {
            throw new Error(`Pathname "${uri.pathname}" does not has a page associated to it`);
        }

        let page: PageManager;
        if (this.#instances.has(uri.pathname)) {
            page = this.#instances.get(uri.pathname);
        } else {
            if (!this.#routingConfig.pages.has(route)) throw Error(`Route "${route}" not found`);
            const pageConfig = this.#routingConfig.pages.get(route);

            page = new PageManager(uri, pageConfig, this.#layoutManager.pagesContainer);
            this.#instances.set(uri.pathname, page);
        }

        if (this.#active) {
            const previous = this.#active;
            await previous.hide().catch(exc => console.error(`Error hiding page "${uri.pathname}"`, exc.stack));
            if (!this.#cancellationToken.check(currentCancellationToken)) return;
        }

        this.#active = page;
        page.show().catch(exc => console.error(`Error showing page "${uri.pathname}"`, exc.stack));
    }

    hide = async () => this.#active && await this.#active.hide();
}
