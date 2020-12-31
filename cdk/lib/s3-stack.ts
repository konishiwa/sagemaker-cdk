#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { Bucket, BucketEncryption, HttpMethods, } from '@aws-cdk/aws-s3';
import {BucketDeployment, Source} from '@aws-cdk/aws-s3-deployment';

export interface S3BucketProps extends cdk.StackProps {
  /** the path to muffin pictures **/
  muffinPath: string;
  /** the path to dog pictures**/
  dogPath: string;
  /** region **/
  region: string;
  /** account */
  account: string;

}

export class S3Bucket extends cdk.Stack {
  public readonly bucket: Bucket;
  constructor(scope: cdk.Construct, id: string, props: S3BucketProps){
     super(scope, id, props);

    const accountName = props.account;
    const bucketName = accountName + '-sagemaker-assets-' + props.region;

    this.bucket = new Bucket(this, 'bucket', {
      bucketName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      encryption: BucketEncryption.S3_MANAGED,
      cors: [
        {
          allowedOrigins: ['*'],
          allowedMethods: [HttpMethods.GET],
          allowedHeaders: ['*'],
        },
      ],
    });

    new BucketDeployment(this, 'DeployFiles', {
      sources: [Source.asset('../imgs')], // 'folder' contains your empty files at the right locations
      destinationBucket: this.bucket,
    });

  }
}