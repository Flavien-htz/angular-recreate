import {Formatter} from "../../services/formatter";
import {Directive} from "../decorators/directive";
import {Input} from "../decorators/input";
import {hostListener} from "../decorators/host-listener";
import {HostBinding} from "../decorators/host-binding";
import {Detector} from "../../framework/change-detector";

@Directive({
    selector: '[phone-number]',
    providers: [
        {
            provide: "formatter",
            construct: () => new Formatter("spécifique")
        }
    ]
})

export class PhoneNumberDirective {

    @Input('with-spaces')
    willHaveSpaces = true;

    @HostBinding('value')
    value = "";


    @Input('border-color')
    @HostBinding("style.borderColor")
    borderColor = "red";

    @HostBinding("placeholder")
    placeholderText = "Hello word !";

    @hostListener("click")
    onclick() {
        this.placeholderText = "Hello Cha !"
    }

    constructor(public element: HTMLElement, private formatter: Formatter) {
    }

    @hostListener('input', ["event.target.value"])
    formatPhoneNumber(value: string) {
        this.value = this.formatter.formatNumber(value, 10, 2, this.willHaveSpaces);
    }

}