#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { S3BucketStack }  from '../lib/s3-stack';
import { IAMStack }  from '../lib/iam-stack';
import { SageMakerStack }  from '../lib/sagemaker-stack';
import { SageMakerWorkerTeamStack }  from '../lib/sagemaker-work-team';
import {LambdaStack } from '../lib/lambda-stack'
import { Arn, Fn } from '@aws-cdk/core';

const app = new cdk.App();

const env = {
    region: 'us-west-2', 
    /** account */
    account:  'bantha'
}

const SagemakerBucketStack = new S3BucketStack(app, 'S3BucketStack', {
  region: env.region,
  account: env.account
});

const SagemakerIAMStack = new IAMStack(app, 'SageMaker-Dog-Muffin-IAM-Stack', {
  bucketArn: SagemakerBucketStack.bucket.bucketArn
});

const SageMakerS3Stack = new SageMakerStack(app, 'SageMaker-Notebook-Stack', {  
  roleArn: SagemakerIAMStack.role.roleArn
}) 

const SMWorkerTeamStack = new SageMakerWorkerTeamStack(app, 'SageMaker-Worker-Team-Stack', {
})

const URI = `s3://${SagemakerBucketStack.bucket.bucketName}/`

const SageMakerLambdaStack = new LambdaStack(app, 'SageMaker-Lambda-Stack', {
  roleArn: SagemakerIAMStack.role.roleArn,
  s3InputURI: URI + 'dog-muffin',
  s3OutputURI: URI,
  s3LabelsURI: URI + 'labels/labels.json', 
  s3WorkerTemplateURI: URI + 'worker-template/worker-template.html',
  smTeamArn: Fn.getAtt(SMWorkerTeamStack.team.logicalId, "Arn").toString()
})


