import {Events} from "@beyond-js/kernel/core";
import {HistoryPosition} from "./position";
import {HistoryRecords} from "./records";
import type {Routing, RoutingMode} from "../routing";

declare function require(module: string): any;

/**
 * Beyond keeps its own history list
 * @constructor
 */
export class BeyondHistory {
    readonly #events: Events;
    readonly #position: HistoryPosition;
    readonly #records: HistoryRecords;

    #initial: number = history.length;
    get initial(): number {
        return this.#initial;
    }

    get records(): string[] {
        return this.#records.data;
    }

    get length(): number {
        return this.#records.length;
    }

    get position(): number {
        return this.#position.value;
    }

    get current(): string {
        return this.#records.current;
    }

    get previous(): string {
        return this.#records.previous;
    }

    get following(): string {
        return this.#records.following;
    }

    #push = (url: string, state: any) => {
        if (!url || !state) throw new Error('Invalid parameters');

        this.#records.resetFromPosition();
        this.#records.push(url);
        this.#position.updateState(state, this.#records.length);
    }

    #processUrl = (url: string): string => {
        const routing = <Routing>(require('../routing')).routing;
        const RoutingModeEnum = <typeof RoutingMode>(require('../routing')).RoutingMode;

        url = url.startsWith('/') ? url : `/${url}`;
        url = routing.mode === RoutingModeEnum.Hash ? `#${url}` : url;
        return url;
    };

    replaceState(state: any, title, url) {
        state = state ? state : {};
        if (typeof state !== 'object') throw new Error('Invalid state parameter');

        if (!this.#position.checkStateIsSet) return;
        this.#position.updateState(state);
        this.#records.updateCurrentUrl(url);

        history.replaceState(state, title, this.#processUrl(url));
    }

    pushState(url: string, state: any) {
        state = state ? state : {};
        if (typeof state !== 'object') throw new Error('Invalid state parameter');

        this.#push(url, state);

        history.pushState(state, null, this.#processUrl(url));
    }

    constructor(events: Events) {
        this.#events = events;
        this.#position = new HistoryPosition(this.#events);
        this.#records = new HistoryRecords(this.#position);

        window.addEventListener('popstate', () => this.#position.updateSessionStorageFromState());

        // When the position in the sessionStorage is not set, it is the first navigation on the tab
        // When the history.state position is not set, it is when the user refreshes the page
        if (!this.#position.getFromSessionStorage() || !this.#position.getFromState()) {
            let url = location.protocol === 'file:' ?
                location.href.substr(location.pathname.length + 7) : // file:// -> 7 chars
                location.href.substr(location.origin.length);

            url = !url ? '/' : url;

            // First page navigation on start up
            const state = history.state ? history.state : {};

            this.#push(url, state);
            history.replaceState(state, null);
        }
        this.#position.updateSessionStorageFromState();
    }
}
