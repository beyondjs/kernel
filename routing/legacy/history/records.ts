import {HistoryPosition} from "./position";

export class HistoryRecords {
    readonly #position: HistoryPosition;
    #records: string[] = [];

    get data(): string[] {
        return this.#records.slice();
    }

    get length(): number {
        return this.#records.length;
    }

    get current(): string {
        return this.#records[this.#position.value - 1]
    }

    get previous(): string {
        return this.#records[this.#position.value - 2];
    }

    get following(): string {
        return this.#records[this.#position.value];
    }

    constructor(position: HistoryPosition) {
        this.#position = position;

        try {
            let stored: any = sessionStorage.getItem('__beyond_navigation_records');
            stored = JSON.parse(stored);
            this.#records = (stored instanceof Array) ? stored : [];
        } catch (exc) {
            console.error('Error loading beyond navigation state', exc instanceof Error ? exc.stack : exc);
            this.#records = [];
        }
    }


    get = (index: number) => this.#records[index];

    /**
     * Push a url to the records stored in the sessionStorage
     * @param {string} url
     */
    push(url: string): void {
        this.#records.push(url);
        sessionStorage.setItem('__beyond_navigation_records', JSON.stringify(this.#records));

        const position = this.#records.length.toString();
        sessionStorage.setItem('__beyond_navigation_position', position);
    };

    /**
     * Reset the list of records from the current position
     * This is required when:
     *      1. The list of browsed pages is greater than one (ex: page1 and page2)
     *      2. The user goes back in the history (ex: to position 1: page1)
     *      3. The user navigates another page (ex: page3)
     *
     * In step 3 is required this method, to clean the records from position 1, and after this
     * execution, the navigation flow can push page3
     */
    resetFromPosition(): void {
        const position = this.#position.getFromSessionStorage();
        position && position < this.#records.length ?
            this.#records = this.#records.slice(0, position) : null;
    };

    updateCurrentUrl(url): void {
        const position = this.#position.getFromSessionStorage();
        this.#records[position - 1] = url;
        sessionStorage.setItem('__beyond_navigation_records', JSON.stringify(this.#records));
    }
}
