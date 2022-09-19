/**
 * Finds the route of a uri. Also supports calling the missing function
 * when the route is not found.
 *
 * @param uri
 * @constructor
 */
import {URI} from "./uri";

declare function require(module: string): any;

export class Route {
    readonly #uri: URI;

    #route: string | undefined;
    get route() {
        return this.#route;
    }

    #bundle: string | undefined;
    get bundle() {
        return this.#bundle;
    }

    #vdir: string | undefined;
    get vdir() {
        return this.#vdir;
    }

    #initialised = false;
    get initialised(): boolean {
        return this.#initialised;
    };

    constructor(uri: URI) {
        this.#uri = uri;
    }

    async initialise() {
        if (this.#initialised) return;
        this.#initialised = true;

        const {pathname} = this.#uri;

        const {routing} = require('../routing');
        if (routing.config.pages.has(pathname)) {
            this.#route = pathname;
            this.#vdir = undefined;
            this.#bundle = routing.config.pages.get(pathname).bundle;
            return;
        }

        let split = pathname.split('/');
        let vdir = [];
        let dir;

        while (dir = split.pop()) {
            vdir.unshift(dir);
            let route = split.join('/');
            route = (route) ? route : '/';

            if (routing.config.pages.has(route)) {
                const config = routing.config.pages.get(route);
                if (vdir.length && !config.vdir) continue; // The page does not support vdir

                this.#route = route;
                this.#vdir = vdir.join('/');
                this.#bundle = config.bundle;

                return;
            }
        }

        if (typeof routing.missing !== 'function') return;

        const bundle = await routing.missing(this.#uri);
        if (!bundle) return;

        if (typeof bundle !== 'string') {
            console.error(`Invalid bundle value set by custom missing function`, bundle);
            return;
        }

        this.#route = this.#uri.pathname;
        this.#bundle = bundle;
    }
}
