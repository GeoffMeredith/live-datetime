/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { Moment } from "moment";
export namespace Components {
    interface LiveDatetime {
        "datetime": string | Moment;
    }
}
declare global {
    interface HTMLLiveDatetimeElement extends Components.LiveDatetime, HTMLStencilElement {
    }
    var HTMLLiveDatetimeElement: {
        prototype: HTMLLiveDatetimeElement;
        new (): HTMLLiveDatetimeElement;
    };
    interface HTMLElementTagNameMap {
        "live-datetime": HTMLLiveDatetimeElement;
    }
}
declare namespace LocalJSX {
    interface LiveDatetime {
        "datetime"?: string | Moment;
    }
    interface IntrinsicElements {
        "live-datetime": LiveDatetime;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "live-datetime": LocalJSX.LiveDatetime & JSXBase.HTMLAttributes<HTMLLiveDatetimeElement>;
        }
    }
}
