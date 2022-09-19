import {SingleCall, beyond} from "@beyond-js/kernel/core";
import {PageManager} from "./page-manager";
import {PageContainer} from "../../../abstract-classes/pages/page-container";
import {PageLegacy} from "../../../abstract-classes/pages/legacy";

export class PageLoader {
    readonly #pageManager: PageManager;

    // The imported module where the Page is exported
    #importedModule: any;

    // The instantiated page
    #page: PageContainer;
    get page() {
        return this.#page;
    }

    #loaded = false;
    get loaded() {
        return this.#loaded;
    }

    #error = '';
    get error() {
        return this.#error;
    }

    constructor(pageManager: PageManager) {
        this.#pageManager = pageManager;
    }

    #pageError = (message: string, exc?: Error) => {
        this.#error = message;
        console.error(this.#error);
        exc && console.error(exc.stack);
    };

    #createPage = async () => {
        const bundle = this.#pageManager.bundle;

        try {

            this.#error = '';

            const PageImported = <typeof PageContainer>this.#importedModule.Page;
            if (!PageImported || typeof PageImported !== 'function') {
                return this.#pageError(`Page on bundle "${bundle}" did not return a valid Page object`);
            }

            // Required for backward compatibility
            if (!(PageImported.prototype instanceof PageContainer)) {
                PageImported.prototype = new (PageLegacy as any)(this.#pageManager);
            }

            this.#page = new PageImported(this.#pageManager);
            if (typeof this.#page.render === 'function') {
                await this.#page.render();
            }

        } catch (exc) {
            return this.#pageError(`Error instantiating page on bundle "${bundle}"`, exc);
        }
    }

    #hmrChangedDetected = async () => {
        try {
            this.#page.destroy();
        } catch (exc) {
            console.error(`Error destroying page "${this.#pageManager.bundle}"`);
        }
        await this.#createPage();
    }

    @SingleCall
    async load() {
        if (this.#loaded || this.#error) return;

        const bundle = this.#pageManager.bundle;
        try {
            this.#importedModule = await beyond.import(bundle);
        } catch (exc) {
            return this.#pageError(`Error importing page from bundle "${bundle}"`, exc);
        }

        await this.#createPage();
        this.#loaded = true;

        // Function .destroy is required to support HMR
        typeof this.#page.destroy === 'function' &&
        this.#importedModule.hmr.on('change:ts',
            () => this.#hmrChangedDetected().catch(exc => console.error(exc.stack))
        );
    }
}
