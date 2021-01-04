#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { CfnWorkteam } from "@aws-cdk/aws-sagemaker";
import { UserPool } from '@aws-cdk/aws-cognito'

export interface SageMakerWorkerTeamStackProps extends cdk.StackProps {

}

export class SageMakerWorkerTeamStack extends cdk.Stack {
    public readonly team: CfnWorkteam;
  constructor(scope: cdk.Construct, id: string, props: SageMakerWorkerTeamStackProps) {
     super(scope, id, props);

     const cognitoUserPool = new UserPool(this, 'SageMaker-User-Pool', {
      userPoolName: 'SageMaker-User-Pool',
      });

     this.team = new CfnWorkteam(this, 'Default-SageMaker-Labeling-Team', {
        workteamName: 'Bantha-Labeling-Team',
        description: 'Default-Labeling-Team', 
        memberDefinitions: [
         {
               cognitoMemberDefinition: {
                  cognitoClientId: 'SageMaker-User-Pool',
                  cognitoUserGroup: 'd-umm_ystring',
                  cognitoUserPool: 'd-ummy_string',
               }
         }
        ],
     })
    
  }
}