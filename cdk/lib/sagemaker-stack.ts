#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import { CfnWorkteam, CfnNotebookInstance } from "@aws-cdk/aws-sagemaker";
import { Bucket } from "@aws-cdk/aws-s3";

export interface SageMakerProps extends cdk.StackProps {
  roleArn: string
}
export class SageMakerStack extends cdk.Stack {
  public readonly bucket: Bucket;
  constructor(scope: cdk.Construct, id: string, props: SageMakerProps) {
    super(scope, id, props);

    //Create sagemaker notebook
    new CfnNotebookInstance(this, 'notebook-dog-muffin-notebook', {
      notebookInstanceName: 'dog-muffin-logic',
      instanceType: "ml.t2.medium",
      roleArn: props.roleArn
    }); 
  }
}
