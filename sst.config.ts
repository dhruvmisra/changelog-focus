import { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { RetentionDays } from "aws-cdk-lib/aws-logs";

export default {
    config(_input) {
        return {
            name: "changelog-focus",
            region: "ap-south-1",
            profile: "dhruv",
        };
    },
    stacks(app) {
        app.stack(function Site({ stack }) {
            const site = new NextjsSite(stack, "web-app", {
                cdk: {
                    server: {
                        architecture: lambda.Architecture.X86_64,
                        logRetention: RetentionDays.ONE_WEEK,
                    },
                },
            });

            stack.addOutputs({
                SiteUrl: site.url,
            });
        });
        if (app.stage !== "prod") {
            app.setDefaultRemovalPolicy("destroy");
        }
    },
} satisfies SSTConfig;
