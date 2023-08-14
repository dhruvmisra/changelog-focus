import { NextjsSite } from "sst/constructs";


export class NextjsSiteWithoutRevalidation extends NextjsSite {
    createRevalidation() {}
}
