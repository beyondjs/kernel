import {URI} from "../uri/uri";
import {LayoutManager} from "./layout-manager/layout-manager";
import {RoutingConfig} from "../config/config";
import {CancellationToken} from "@beyond-js/kernel/core";

export class Layouts {
    readonly #config: RoutingConfig;

    #instances: Map<string, LayoutManager> = new Map;

    #active: LayoutManager;
    get active() {
        return this.#active;
    }

    constructor(config: RoutingConfig) {
        this.#config = config;
    }

    // Avoid to continue the execution on asynchronous calls, when a newest call's been made
    #cancellationToken = new CancellationToken;

    // Navigate the uri once the active layout is set
    #navigate = (uri: URI) => {
        this.#active.show(uri).catch(
            exc => console.error(`Error showing layout "${this.#active.name}"`, exc.stack));
    }

    // Navigates a uri setting the active layout first
    async navigate(uri: URI) {
        const currentCancellationToken = this.#cancellationToken.reset();

        const route = uri.route.route;
        if (!route) {
            throw new Error(`Pathname "${uri.pathname}" does not has a page associated to it`);
        }

        if (!this.#config.pages.has(route)) {
            throw Error(`Route "${route}" not found`);
        }

        const pageConfig = this.#config.pages.get(route);
        const layoutName = pageConfig.layout ? pageConfig.layout : 'default';

        if (layoutName !== 'default' && !this.#config.layouts.has(layoutName)) {
            console.error(`The layout "${layoutName}" required by route "${route}" ` +
                `in the bundle "${pageConfig.bundle}" was not found`);
            return;
        }

        if (this.#active && layoutName === this.#active.name) {
            this.#navigate(uri);
            return;
        }

        let layout: LayoutManager;
        if (this.#instances.has(layoutName)) {
            layout = this.#instances.get(layoutName);
        } else {
            layout = new LayoutManager(layoutName, this.#config);
            this.#instances.set(layoutName, layout);
        }

        if (this.#active) {
            const previous = this.#active;
            await previous.hide().catch(exc => console.error(`Error hiding layout "${layoutName}"`, exc.stack));
            if (!this.#cancellationToken.check(currentCancellationToken)) return;
        }

        this.#active = layout;
        this.#navigate(uri);
    }
}
