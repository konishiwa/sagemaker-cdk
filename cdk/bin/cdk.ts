#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { S3BucketStack }  from '../lib/s3-stack';

const app = new cdk.App();

const env = {
    region: 'us-west-2', 
    /** account */
    account:  'bantha'
}

const wsStaticAssetsS3Stack = new S3BucketStack(app, 'S3BucketStack', {
  region: env.region,
  account: env.account
});