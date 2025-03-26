import {ModuleTexts} from "./texts";
import type {IModuleSpecs, Module} from "../module";
import {ModuleCurrentTexts} from "./current";

export class ModuleTextsLanguages<TextsDeclaration> {
    readonly #texts: Map<string, ModuleTexts<TextsDeclaration>> = new Map();

    readonly #module: Module;
    get module() {
        return this.#module;
    }

    readonly #specs: IModuleSpecs;
    get specs() {
        return this.#specs;
    }

    readonly #current: ModuleCurrentTexts<TextsDeclaration>;
    get current() {
        return this.#current;
    }

    /**
     * Module texts constructor
     *
     * @param {Module} module The module that holds the texts bundle
     * @param {IModuleSpecs} specs To know which txt bundles are present
     */
    constructor(module: Module, specs: IModuleSpecs) {
        this.#module = module;
        this.#specs = specs;

        this.#current = typeof window === 'object' ? new ModuleCurrentTexts(module, specs.txt?.multilanguage) : void 0;
    }

    get(bundle: string, language: string) {
        const key = `${bundle}/${language}`;
        if (this.#texts.has(key)) return this.#texts.get(key);

        const multilanguage = bundle === 'txt' ? !!this.#specs.txt?.multilanguage : true;
        const texts: ModuleTexts<TextsDeclaration> = new ModuleTexts(this.#module, bundle, multilanguage, language);

        this.#texts.set(key, texts);
        return texts;
    }
}
