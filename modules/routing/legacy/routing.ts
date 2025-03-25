import {URI} from "./uri/uri";
import {Layouts} from "./layouts/layouts";
import {RoutingConfig} from "./config/config";
import {CancellationToken, Events} from "@beyond-js/kernel/core";
import {BeyondHistory} from "./history/history";

export enum RoutingMode {Hash, Pathname}

export class Routing {
    #events = new Events;

    #valid = true;
    get valid() {
        return this.#valid;
    }

    #mode: RoutingMode;
    get mode() {
        return this.#mode;
    }

    readonly #config = new RoutingConfig;
    get config() {
        return this.#config
    };

    #layouts = new Layouts(this.#config);

    #uri: URI;
    get uri(): URI {
        return this.#uri;
    }

    missing: (uri: URI) => string;
    redirect: (uri: URI) => string;

    #history = new BeyondHistory(this.#events);
    get history() {
        return this.#history;
    }

    #initialised = false;
    get initialised() {
        return this.#initialised;
    }

    setup(routingMode: RoutingMode) {
        if (this.#initialised) {
            throw new Error('Routing setUp method can only be called once');
        }

        if (location.protocol === 'file:' && routingMode === RoutingMode.Pathname) {
            routingMode = RoutingMode.Hash;
            console.warn('Routing mode was set as "pathname" but it was changed to ' +
                '"hash" because the protocol used is "file:"');
        }

        if (![0, 1].includes(routingMode)) {
            console.warn(`Routing mode ${routingMode} is invalid`);
            routingMode = location.protocol === 'file:' ? RoutingMode.Hash : RoutingMode.Pathname;
        }

        this.#mode = routingMode;
        this.#initialised = true;

        this.update().catch(exc => console.error(exc.stack));
    }

    #redirect = async (uri: URI): Promise<boolean> => {
        if (typeof this.redirect !== 'function') return;

        const redirected = await this.redirect(uri);
        if (!redirected) return;
        if (typeof redirected !== 'string') {
            console.error(`Invalid route value set by custom routing function`, redirected);
            return;
        }

        if (uri.pathname === redirected) return; // Routing function returned the actual route

        this.pushState(redirected);

        return true;
    };

    pushState(url: string, state?: object): void {
        this.#history.pushState(url, state);
        this.update().catch((exc) => console.error(exc.stack));
    };

    replaceState(state: object, title: string, url?: string): void {
        this.#history.replaceState(state, title, url);
        this.update().catch((exc) => console.error(exc.stack));
    };

    // Avoid to continue the execution on asynchronous calls, when a newest call's been made
    #cancellationToken = new CancellationToken;
    update = async () => {
        if (!this.#initialised) return;

        const cancellationTokenId = this.#cancellationToken.reset();

        if (this.#uri && this.#uri.href === location.href) return;

        const uri = new URI(location.href);
        this.#uri = uri;

        const redirected = await this.#redirect(uri);
        if (!this.#cancellationToken.check(cancellationTokenId)) return;
        if (redirected) return; // The page was redirected to another url

        await uri.initialise(); // Parse the uri and check the missing function if the route is not found
        if (!this.#cancellationToken.check(cancellationTokenId)) return;

        // Verify the state of the history registry to check for possible errors
        if (uri.url !== this.#history.current) {
            console.error(`History current ${this.#history.current} is not equal to actual url "${uri.url}"`);
            this.#valid = false;
            this.#events.trigger('error');
            return;
        }

        this.#layouts.navigate(uri).catch(exc => console.error(exc instanceof Error ? exc.stack : exc));
    };

    back = () => window.history.length ? window.history.back() : this.pushState('/');
}

export /*bundle*/ const routing = new Routing;
(<any>window).routing = routing;

declare const beyond: any;
(<any>beyond).navigate = (url: string, state?: object) => routing.pushState(url, state);
(<any>beyond).pushState = (url: string, state?: object) => routing.pushState(url, state);
(<any>beyond).back = () => routing.back();

window.addEventListener('popstate', () => routing.update().catch(exc => console.error(exc.stack)));
