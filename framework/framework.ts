import {CreditCardDirective} from "../src/directives/credit-card.directive";
import {PhoneNumberDirective} from "../src/directives/phone-number.directive";
import {Module, ProvidersMetadata, ServiceInstances} from "./types";
import {set} from "lodash";
import {Detector} from "./change-detector";
import {NgZone} from "./zone";


export class Framework {
    /**
     * Le tableau qui recense l'ensemble des directives déclarées dans le projet
     */
    directives: any[] = [];
    /**
     * Le tableau qui contient les instances de services déj construites (pour ne pas avoir à les reconstruire indéfiniment)
     */
    services: ServiceInstances = [];
    /**
     * Le tableau qui contient les définitions de mes services (comment construire tel ou tel service)
     */
    providers: ProvidersMetadata = [];

    /**
     * Le traitement qui va instancier les directives et les gréffer aux élements HTML ciblés par les sélecteurs CSS
     */
    bootstrapApplication(metadata: Module) {
        this.providers = metadata.providers || [];
        this.directives = metadata.declarations;
        NgZone.run(() => {

            this.directives.forEach(directive => {

                const elements = document.querySelectorAll<HTMLElement>(directive.selector);

                elements.forEach(element => {

                    const params = this.analyseDirectiveConstructor(directive, element);
                    // @ts-ignore
                    const directiveInstance = Reflect.construct(directive, params)

                    const proxy = new Proxy(directiveInstance, {
                        set(target, propName: string, value, proxy) {

                            target[propName] = value;

                            if (!target.bindings) {
                                return true;
                            }

                            const binding = target.bindings.find(b => b.propName == propName);

                            if (!binding) {
                                return true;
                            }

                            Detector.addBinding(element, binding.attrName, value);

                            return true;
                        }
                    });
                    proxy.init();
                })
            })
        })
    }

    /**
     * Permet d'analyser les besoins d'un constructeur et de créer les instances necessaires (les dépendances)
     * @param directive La classe de la directive à instancier
     * @param element L'élement HTML sur lequel on veut greffer la directive
     * @returns Le tableau de paramètre necessaire pour instancier ma directive
     * @private
     */
    private analyseDirectiveConstructor(directive, element: HTMLElement) {
        const hasConstructor = /constructor\(.*\)/g.test(directive.toString());

        if (!hasConstructor) {
            return [];
        }

        const paramsNames = this.extractParamNamesFromDirective(directive);

        return paramsNames.map((name) => {
            if (name == "element") {
                return element;
            }

            const directiveProviders = directive.providers || [];

            const directiveProvider = directiveProviders.find(p => p.provide === name);

            if (directiveProvider) {
                return directiveProvider.construct();
            }

            // @ts-ignore
            const service = this.services.find(s => s.name === name);

            if (service) {
                return service.instance;
            }

            // @ts-ignore
            const provider = this.providers.find((p) => p.provide === name);
            if (!provider) {
                throw new Error("Aucun fournisseur n'existe pour le service" + name);
            }

            const instance = provider.construct();

            this.services.push({
                name: name,
                instance: instance
            });

            return instance;

        });
    }

    /**
     * Extrait les oms des paramètres du constructeur d'une directive
     * @param directive La directive dont je veux connaitre les paramètres
     * @private Un tableau avec les noms des paramètres du constructeur
     */
    private extractParamNamesFromDirective(directive) {
        const params = /constructor\((.*)\)/g.exec(directive.toString());
        if (!params) {
            return [];
        }

        return params[1].split(", ");
    }
}

export const Angular = new Framework();