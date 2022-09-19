import {PagesConfig} from "./pages";
import {LayoutsConfig} from "./layouts";

export class RoutingConfig {

    readonly #layouts = new LayoutsConfig;
    get layouts() {
        return this.#layouts
    };

    readonly #pages = new PagesConfig;
    get pages() {
        return this.#pages
    };

}
