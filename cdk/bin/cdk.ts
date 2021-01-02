#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { S3BucketStack }  from '../lib/s3-stack';
import { SageMakerStack }  from '../lib/sagemaker-stack';

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

const SageMakerS3Stack = new SageMakerStack(app, 'SageMakerStack', {
  region: env.region,
  account: env.account,
  bucket: SagemakerBucketStack.bucket
}) 