/**
 * It is required to allow backward compatibility
 * The reason why it exists is because the page manager creates an instance of the Page
 * and sets the Page (PageLegacy in fact) as a prototype, and the private
 * properties of Page doesn't work under this design, the PageLegacy solves this issue
 */
import {PageContainer} from "./page-container";
import {PageManager} from "../../layout-manager/pages/page-manager/page-manager";
import {Route} from "../../../uri/route";
import type {QueryString} from "../../../uri/querystring";

export class PageLegacy {
    base: PageContainer;

    constructor(pageManager: PageManager) {
        this.base = new PageContainer(pageManager);
    }

    get container(): HTMLElement {
        return this.base.container;
    }

    get route(): Route {
        return this.base.route;
    }

    get pathname(): string {
        return this.base.pathname;
    }

    get vdir(): string {
        return this.base.vdir;
    }

    get search(): string {
        return this.base.search;
    }

    get qs(): QueryString {
        return this.base.qs;
    }

    get querystring(): QueryString {
        return this.base.qs;
    }
}
