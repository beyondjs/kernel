import type React from "react";
import {LayoutManager} from "../../layout-manager/layout-manager";
import {Events} from "@beyond-js/kernel/core";

export /*bundle*/
interface IContainerControl {
    container: React.RefObject<HTMLDivElement>;
}

export /*bundle*/
interface LayoutContainer {
    control: IContainerControl;

    render(): void;

    show(): Promise<void>;

    hide(): Promise<void>;

    rendered(): void;
}

export /*bundle*/
class LayoutContainer extends Events {
    #layoutManager: LayoutManager;

    get container(): HTMLElement {
        return this.#layoutManager.container;
    }

    constructor(layoutManager: LayoutManager) {
        super();
        this.#layoutManager = layoutManager;
    }

    rendered = () => this.#layoutManager.rendered() as void;
}
