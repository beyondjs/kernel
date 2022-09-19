import LegacyStyles from "./legacy";
import {V1Styles} from "./v1";

class Registry {
    #registry: Map<string, LegacyStyles | V1Styles> = new Map();

    register(bundle: string, value: string) {
        if (this.#registry.has(bundle)) return;
        const styles = value ? new LegacyStyles(bundle, value) : new V1Styles(bundle);
        this.#registry.set(bundle, styles);
        return styles;
    }

    has(bundle: string) {
        return this.#registry.has(bundle);
    }

    get(bundle: string) {
        return this.#registry.get(bundle);
    }
}

export /*bundle*/ const styles = new Registry();

// Just for legacy projects
(globalThis as any).beyondLegacyStyles = styles;
