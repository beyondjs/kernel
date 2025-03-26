import {Events} from "@beyond-js/kernel/core";

/**
 * The position of the navigation is stored this way:
 *      1. In the state of each page (the history.state object), it is stored the position
 *         in which the page is located. To achieve this, the __beyond_navigation_position property
 *         is added to the state object.
 *      2. In the sessionStorage is stored the current position (__beyond_navigation_position)
 */
export class HistoryPosition {
    readonly #events: Events;

    constructor(events: Events) {
        this.#events = events;
    }

    #ERROR_INVALID_STATE = 'History state is not defined. ' +
        'This happen when state is changed outside the beyond defined navigation flows.';

    #valid = true;
    get valid() {
        return this.#valid;
    }

    /**
     * Returns the position from the history.state
     * @returns {number | undefined}
     */
    get value(): number | undefined {
        const position = history.state ? history.state.__beyond_navigation_position : undefined;
        return this.checkStateIsSet ? position : undefined;
    }

    /**
     * Check if the position is already stored in the history.state.
     * If it is not, then an error message is shown.
     *
     * @returns {boolean}
     */
    get checkStateIsSet(): boolean {
        if (!this.#valid) return false;

        const position = history.state ? history.state.__beyond_navigation_position : undefined;
        position === undefined && console.error(this.#ERROR_INVALID_STATE);
        this.#valid = this.#valid && position !== undefined;

        position !== undefined && this.#events.trigger('error');
        return position !== undefined;
    }

    /**
     * Set the position in the history.state
     *
     * @param state {any} The state object before being stored in the history.state. In this method
     * the state object will be updated to store the position
     * @param {number} position
     */
    updateState(state: any, position?: number): void {
        if (typeof state !== 'object') {
            throw new Error('Parameter state must be an object');
        }

        state.__beyond_navigation_position = position === undefined ?
            history.state.__beyond_navigation_position : position;
    }

    /**
     * Stores in the sessionStorage the position getting its value from the history.state
     */
    updateSessionStorageFromState() {
        if (!this.checkStateIsSet) return;
        const position = history.state ? history.state.__beyond_navigation_position : undefined;
        sessionStorage.setItem('__beyond_navigation_position', position);
    }

    /**
     * Returns the position of the navigation flow from the sessionStorage
     * @returns {string}
     */
    getFromSessionStorage(): number | undefined {
        const position = sessionStorage.getItem('__beyond_navigation_position');
        return typeof position === 'string' ? parseInt(position) : undefined;
    }

    /**
     * Returns the position of the navigation flow from the history.state.
     * It is equivalent to obtaining this same value directly from the .state property,
     * with the difference that the .state property verifies that the value is stored
     * and displays an error if it is not
     * @returns {any}
     */
    getFromState = () => history.state ? history.state.__beyond_navigation_position : undefined;
}
