import {HistoryPosition} from "./position";

interface IHistoryEntry {
    uri: string,
    position: number,
}

export class HistoryRecords {
    readonly #position: HistoryPosition;

    #entries: IHistoryEntry[] = [];
    get entries(): IHistoryEntry[] {
        return this.#entries.slice();
    }

    get length(): number {
        return this.#entries.length;
    }

    get current(): IHistoryEntry {
        return this.#entries[this.#position.value - 1]
    }

    get previous(): IHistoryEntry {
        const previous = this.#position.value - 2;
        if (previous < 0) return;
        return this.#entries[previous];
    }

    get following(): IHistoryEntry {
        const following = this.#position.value;
        if (following >= this.#entries.length) return;
        return this.#entries[following];
    }

    constructor(position: HistoryPosition) {
        this.#position = position;

        let parsed: IHistoryEntry[];
        try {
            const stored = sessionStorage.getItem('__beyond_navigation_records');
            parsed = stored ? JSON.parse(stored) : [];
        } catch (exc) {
            console.error('Error loading beyond navigation state', exc instanceof Error ? exc.stack : exc);
            this.#entries = [];
        }

        if (!(parsed instanceof Array)) {
            const warning = 'The beyond navigation data, stored in session store is invalid.';
            console.warn(warning, parsed);
        }

        this.#entries = parsed;
    }

    /**
     * Set the URI always starting with '/' no matter the routing mode (hash or pathname)
     *
     * @param {string} uri
     * @return {string}
     */
    #sanitizeURI(uri: string): string {
        void (this);
        if (uri === void 0) return;
        return uri.startsWith('/') ? uri : `/${uri}`;
    }

    get(index: number): IHistoryEntry {
        return this.#entries[index];
    }


    /**
     * Push a uri to the records stored in the sessionStorage
     * @param {string} uri
     */
    push(uri: string): void {
        uri = this.#sanitizeURI(uri);
        this.#entries.push({uri, position: history.length});
        this.save();
    }

    /**
     * Reset the list of records from the current position
     * This is required when:
     *      1. The list of browsed pages is greater than one (ex: page1 and page2)
     *      2. The user goes back in the history (ex: to position 1: page1)
     *      3. The user navigates another page (ex: page3)
     *
     * This method is required in step 3, to clean the records from position 1, and after this
     * execution, the navigation flow can push page3
     */
    reset(): void {
        const position = this.#position.value;
        if (position) return;

        this.#entries = this.#entries.filter(entry => entry.position < history.length);
    }

    updateCurrentURI(uri: string): void {
        const position = this.#position.value;

        uri = this.#sanitizeURI(uri);
        this.#entries[position - 1] = {uri, position: history.length};
        this.save();
    }

    save() {
        sessionStorage.setItem('__beyond_navigation_records', JSON.stringify(this.#entries));
    }
}
