import type {BundleWrapperFnc} from "./bundle";
import {TransversalBundle} from "./bundle";
import type {Transversal} from "./transversal";
import {IBundleFactorySpecs} from "../bundles/instances/instances";

export type Creators = Map<string, { hash: number, specs: IBundleFactorySpecs, creator: BundleWrapperFnc }>;

export class Bundles extends Map<string, TransversalBundle> {
    readonly #transversal: Transversal;

    constructor(transversal: Transversal) {
        super();
        this.#transversal = transversal;
    }

    #register = (id: string, hash: number, specs: IBundleFactorySpecs, creator: BundleWrapperFnc) => {
        const bundle = new TransversalBundle(this.#transversal, id, hash, specs, creator);
        this.set(bundle.id, bundle);
    }

    initialise(bundles: Creators) {
        bundles.forEach(({creator, specs, hash}, id) =>
            this.#register(id, hash, specs, creator));
        this.forEach(bundle => bundle.initialise());
    }
}
