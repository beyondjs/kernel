import type React from "react";
import {SingleCall, beyond} from "@beyond-js/kernel/core";
import {LayoutManager} from "./layout-manager";
import {LayoutContainer} from "../abstract-classes/layouts/layout";
import {LayoutLegacy} from "../abstract-classes/layouts/legacy";

export class LayoutLoader {
    readonly #layoutManager: LayoutManager;

    #layout: LayoutContainer;
    get layout() {
        return this.#layout;
    }

    #pagesContainer: React.RefObject<HTMLDivElement>;
    get pagesContainer() {
        return this.#pagesContainer;
    }

    #loaded = false;
    get loaded() {
        return this.#loaded;
    }

    get ready() {
        return this.#loaded;
    }

    #error = '';
    get error() {
        return this.#error;
    }

    constructor(layoutManager: LayoutManager) {
        this.#layoutManager = layoutManager;
    }

    @SingleCall
    async load() {
        if (this.#loaded || this.#error) return;

        const {bundle} = this.#layoutManager;

        const failed = (message: string, exc?: Error) => {
            this.#error = message;
            console.error(this.#error);
            exc && console.error(exc.stack);
        };

        let LayoutImported: typeof LayoutContainer;
        try {
            LayoutImported = (await beyond.import(bundle)).Layout;
        } catch (exc) {
            return failed(`Error importing layout from bundle "${bundle}"`, exc);
        }

        if (!LayoutImported || typeof LayoutImported !== 'function') {
            return failed(`Layout on bundle "${bundle}" did not return a valid Layout object`);
        }

        try {

            // Required for backward compatibility
            if (!(LayoutImported.prototype instanceof LayoutContainer)) {
                LayoutImported.prototype = new (LayoutLegacy as any)(this.#layoutManager);
            }
            this.#layout = new LayoutImported(this.#layoutManager);

            if (typeof this.#layout.render === 'function') {
                await this.#layout.render();
            }

            if (!this.#layout.control || !this.#layout.control.container) {
                return failed(`Error in Layout: the layout must expose a .control.container property`);
            }

            this.#pagesContainer = this.#layout.control.container;

        } catch (exc) {
            return failed(`Error instantiating layout on bundle "${bundle}"`, exc);
        }

        this.#loaded = true;
    }
}
