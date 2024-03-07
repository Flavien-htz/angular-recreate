import {set} from "lodash";

/**
 *
 * Permet de lié une propriété de ma directive à une propriété de l'élèment HTML auquel ma directive est liée
 *
 * Exemple #1
 * @HostBinding("placeholder")
 * placeHolderText = "Hello world";
 *
 * Exemple #2 (propriété imbriquée)
 * @HostBinding('style.color')
 * color = "red"
 *
 *
 * @param attrName L'attribut que l'on souhaite lié à la propriété de la directive
 */
export function HostBinding(attrName: string) {
    return function (decoratedClass, propName: string) {

        const originalInitFunction: Function = decoratedClass["init"] || function () {
        };

        const bindings: any[] = decoratedClass["bindings"] || [];

        bindings.push(
            {
                attrName, propName
            }
        )

        decoratedClass["bindings"] = bindings;

        decoratedClass["init"] = function () {
            originalInitFunction.call(this);
            set(this.element, attrName, this[propName])
        }

    }
}