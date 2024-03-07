import {CreditCardDirective} from "./directives/credit-card.directive";
import {PhoneNumberDirective} from "./directives/phone-number.directive";
import {Formatter} from "../services/formatter";
import {CreditCardVerifier} from "../services/credit-card-verifier";
import {Angular} from "../framework/framework";
import {ProvidersMetadata} from "../framework/types";
import {NgZone} from "../framework/zone";
import {ChronoDirective} from "./directives/chrono.directive";

Angular.bootstrapApplication({
    declarations:
        [
            CreditCardDirective,
            PhoneNumberDirective,
            ChronoDirective
        ],
    providers: [
        {
            provide: "formatter",
            construct: () => new Formatter("global")
        },
        {
            provide: "verifier",
            construct: () => new CreditCardVerifier()
        }
    ]
});
