import * as cdk from '@aws-cdk/core';
import { Role, ServicePrincipal, PolicyStatement } from "@aws-cdk/aws-iam";
import * as path from 'path';

export interface IAMStackProps extends cdk.StackProps {
  /**source bucket */
  bucketArn: string;
}

//Lambdda function to invoke CfnCustomResource creation 
export class IAMStack extends cdk.Stack {
  public readonly role: Role;
  constructor(scope: cdk.Construct, id: string, props: IAMStackProps){
     super(scope, id, props);

         //Create Role with Full Sagemaker Access
    this.role = new Role(this, "SageMaker-FullAccess-Role", {
        assumedBy: new ServicePrincipal("sagemaker.amazonaws.com"),
        roleName: "sagemaker-full-access",
        managedPolicies: [
          {
            managedPolicyArn: "arn:aws:iam::aws:policy/AmazonSageMakerFullAccess",
          },
        ],
      });
  
      //add inline policy to specific bucket
      this.role.addToPolicy(
        new PolicyStatement({
          resources: [props.bucketArn],
          actions: ["s3:GetObject", "s3:PutObject", "s3:DeleteObject", "s3:ListBucket"],
        })
      );
    }
  }
  