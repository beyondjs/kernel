/**
 * Uri parser
 *
 * @param href {string} The href to be parsed
 * @constructor
 */
import {Route} from "./route";
import {QueryString} from "./querystring";

declare function require(module: string): any;

export class URI {
    #parser = document.createElement('a');

    readonly #route: Route;
    get route() {
        return this.#route;
    }

    readonly #url: string;
    get url(): string {
        return this.#url;
    }

    readonly #pathname: string;
    get pathname(): string {
        return this.#pathname;
    }

    get protocol(): string {
        return this.#parser.protocol;
    }

    get hostname(): string {
        return this.#parser.hostname;
    }

    get origin(): string {
        return this.#parser.origin;
    }

    get port(): string {
        return this.#parser.port;
    }

    get host(): string {
        return this.#parser.host;
    }

    get href(): string {
        return this.#parser.href;
    }

    get search(): string {
        return this.#parser.search;
    }

    readonly #qs: QueryString;
    get qs() {
        return this.#qs;
    }

    constructor(href: string) {
        const {routing, RoutingMode} = require('../routing');

        const parser = this.#parser;
        parser.href = href;

        let url = parser.protocol === 'file:' ?
            href.substr(parser.pathname.length + 7) : // file:// -> 7 chars
            href.substr(parser.origin.length);

        url = url.startsWith('#') ? `/${url.substr(1)}` : url;
        url = url.startsWith('/#') ? `/${url.substr(2)}` : url;
        this.#url = !url ? '/' : url;

        const hash = parser.hash.startsWith('#') ? parser.hash.substr(1) : '';
        this.#pathname = routing.mode === RoutingMode.Hash ? `/${hash}` : parser.pathname;
        this.#qs = new QueryString(parser.search);
        this.#route = new Route(this);
    }

    initialise = () => this.#route.initialise();
}
