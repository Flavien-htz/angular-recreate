import {DirectiveMetadata} from "../../framework/types";

export function Directive(metadata: DirectiveMetadata){
    return function(decoratedClass){
        decoratedClass["selector"] = metadata.selector;
        decoratedClass["providers"] = metadata.providers || [];
        return decoratedClass;

    }
}