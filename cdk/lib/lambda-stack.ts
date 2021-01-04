#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import * as path from 'path';

export interface LambdaStackProps extends cdk.StackProps {

  roleArn: string;
  s3InputURI: string;
  s3OutputURI:string;
  s3LabelsURI:string
  s3WorkerTemplateURI:string;
  smTeamArn: string;

}

//Lambdda function to invoke CfnCustomResource creation 
export class LambdaStack extends cdk.Stack {
  public readonly function: Function;
  constructor(scope: cdk.Construct, id: string, props: LambdaStackProps){
     super(scope, id, props);

    const fn = new Function(this, 'Sagemaker-Resource-Creator-Function-', {
        runtime: Runtime.NODEJS_10_X,
        handler: 'index.handler',
        code: Code.fromAsset('./resources/lambda'),
        environment: {
          'ROLE_ARN': props.roleArn,
          'S3_INPUT_URI': props.s3InputURI,
          'S3_OUTPUT_URI': props.s3OutputURI,
          'S3_LABELS_URI': props.s3LabelsURI,
          'SM_TEAM_ARN': props.smTeamArn,
          'S3_WORKERTEMPLATE_URI': props.s3WorkerTemplateURI,       
        }
      });

  }
}
