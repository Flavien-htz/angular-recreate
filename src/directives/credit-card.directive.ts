import {Formatter} from "../../services/formatter";
import {CreditCardVerifier} from "../../services/credit-card-verifier";
import {Directive} from "../decorators/directive";
import {HostBinding} from "../decorators/host-binding";
import {hostListener} from "../decorators/host-listener";

@Directive({
    selector: "[credit-card]",
})
export class CreditCardDirective {

    @HostBinding('style.borderColor')
    borderColor = "blue";


    constructor(public element: HTMLElement, private formatter: Formatter, private verifier: CreditCardVerifier) {
    }

    @hostListener('input', ["event.target"])
    formatCreditCard(element: HTMLInputElement) {
        element.value = this.formatter.formatNumber(element.value, 16, 4, true)
    }
}