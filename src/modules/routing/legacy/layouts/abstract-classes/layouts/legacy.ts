/**
 * It is required to allow backward compatibility
 * The reason why it exists is because the layout manager creates an instance of the Layout
 * and sets the Layout (LayoutLegacy in fact) as a prototype, and the private
 * properties of Layout doesn't work under this design, the LayoutLegacy solves this issue
 */
import {LayoutContainer} from "./layout";
import {LayoutManager} from "../../layout-manager/layout-manager";

export class LayoutLegacy {
    base: LayoutContainer;

    on = (event: string, listener: (...args: any) => void) => this.base.on(event, listener);
    off = (event: string, listener: (...args: any) => void) => this.base.off(event, listener);
    bind = (event: string, listener: (...args: any) => void) => this.base.bind(event, listener);
    unbind = (event: string, listener: (...args: any) => void) => this.base.unbind(event, listener);

    constructor(layoutManager: LayoutManager) {
        this.base = new LayoutContainer(layoutManager);
    }

    get container(): HTMLElement {
        return this.base.container;
    }

    rendered = () => this.base.rendered();
}
