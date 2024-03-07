import {HostBinding} from "../decorators/host-binding";
import {Directive} from "../decorators/directive";
import {hostListener} from "../decorators/host-listener";

@Directive({
    selector: "div[chrono]"
})
export class ChronoDirective {
    @HostBinding('textContent')
    count = 0;

    intervalId: number;



    constructor(public element: HTMLElement) {
    }

    @hostListener("click")
    onClick(){
        if(this.intervalId){
            window.clearInterval(this.intervalId);
            this.count = 0;
            this.intervalId = undefined;
            return;
        }

        this.intervalId = window.setInterval(() => this.count++, 1000);

    }

    init(){
        this.intervalId = window.setInterval(() => this.count++, 1000);
    }
}