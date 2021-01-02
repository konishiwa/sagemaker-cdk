#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import { Role, ServicePrincipal, PolicyStatement } from "@aws-cdk/aws-iam";
import { CfnWorkteam, CfnNotebookInstance } from "@aws-cdk/aws-sagemaker";
import fs = require("fs");
import { Bucket } from "@aws-cdk/aws-s3";

export interface SageMakerProps extends cdk.StackProps {
  /** region **/
  region: string;
  /** account */
  account: string;
  /**source bucket */
  bucket: Bucket;
}

export class SageMakerStack extends cdk.Stack {
  public readonly bucket: Bucket;
  constructor(scope: cdk.Construct, id: string, props: SageMakerProps) {
    super(scope, id, props);

    //Create Role with Full Sagemaker Access
    const sagemakerRole = new Role(this, "SageMaker-FullAccess-Role", {
      assumedBy: new ServicePrincipal("sagemaker.amazonaws.com"),
      roleName: "sagemaker-full-access",
      managedPolicies: [
        {
          managedPolicyArn: "arn:aws:iam::aws:policy/AmazonSageMakerFullAccess",
        },
      ],
    });

    //add inline policy to specific bucket
    sagemakerRole.addToPolicy(
      new PolicyStatement({
        resources: [props.bucket.bucketArn],
        actions: ["s3:GetObject", "s3:PutObject", "s3:DeleteObject", "s3:ListBucket"],
      })
    );

    //Create sagemaker notebook
    new CfnNotebookInstance(this, props.account+"-dog-muffin-notebook-"+props.region, {
      notebookInstanceName: 'dog-muffin-logic',
      instanceType: "ml.t2.medium",
      roleArn:
      sagemakerRole.roleArn,
    }); 
  }
}
