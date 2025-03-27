import type {Transversal} from "./transversal";
import type {Bundle} from "../bundles/bundle";
import type {Package} from "../bundles/package/package";
import type {Creators} from "../bundles/package/ims/ims";
import {IBundleFactorySpecs, instances} from "../bundles/instances/instances";

export type BundleWrapperFnc = (transversal: Transversal, bundle: Bundle, __pkg: Package) => Creators;

export type BundleSpecs = { hash: number, creator: BundleWrapperFnc };

export class TransversalBundle {
    readonly #transversal: Transversal;
    get transversal() {
        return this.#transversal;
    }

    readonly #id: string;
    get id() {
        return this.#id;
    }

    readonly #hash: number;
    get hash() {
        return this.#hash;
    }

    readonly #specs: IBundleFactorySpecs;
    get specs() {
        return this.#specs;
    }

    readonly #creator: BundleWrapperFnc;
    #created = false;
    get created() {
        return this.#created;
    }

    #create = () => {
        if (this.#created) throw new Error(`Transversal bundle "${this.#id}" already created`);

        const {multilanguage, language} = this.#transversal;
        const bundle = instances.obtain(this.#id, multilanguage, this.#specs);
        const pkg = bundle.package(language);

        const ims: Creators = this.#creator(this.#transversal, bundle, pkg);
        pkg.initialise(ims);
        this.#created = true;
    }

    initialise() {
        !this.#created && this.#create();
    }

    constructor(transversal: Transversal, id: string, hash: number, specs: IBundleFactorySpecs, creator: BundleWrapperFnc) {
        this.#transversal = transversal;
        this.#id = id;
        this.#hash = hash;
        this.#specs = specs;
        this.#creator = creator;
    }
}
