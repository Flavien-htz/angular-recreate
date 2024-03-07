/**
 * Permet de lier une méthode de la directve à un évènement qui aura lieu sur l'élèment HTML
 *
 * @param eventName L'évèement auquel on soihate reagir et lier la méthode
 * @param params Tableau des params dont on a besoin
 *
 * Par exemple :
 *
 * @HostListener('click', ["event.target"]
 * onClick(target) {}
 */
export function hostListener(eventName: string, params: (string | number)[] = []) {
    return function (decoratedClass, methodName: string) {
        const originalInitFunction: Function = decoratedClass["init"] || function () {
        };

        decoratedClass["init"] = function () {
            originalInitFunction.call(this);
            this.element.addEventListener(eventName, (event) => {
                const paramsToSend = params.map(param => eval(param.toString()));

                this[methodName](...paramsToSend);
            })
        }
    }
}