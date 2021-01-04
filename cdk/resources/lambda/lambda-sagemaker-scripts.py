import os
import boto3
import time
import sagemaker
from sagemaker import get_execution_role
from sagemaker.amazon.amazon_estimator import get_image_uri

ROLE_ARN=os.environ['ROLE_ARN']
S3_INPUT_URI=os.environ['S3_INPUT_URI']
S3_OUTPUT_URI=os.environ['S3_OUTPUT_URI']
S3_LABELS_URI=os.environ['S3_LABELS_URI']
SM_TEAM_ARN=os.environ['S3_LABELS_URI']
S3_WORKERTEMPLATE_URI=os.environ['S3_LABELS_URI']

sagemaker = boto3.client('sagemaker')

def lambda_handler(event, context):

    #create labeling job 
    sagemaker_labeling_job= sagemaker.describe_labeling_job(
        LabelingJobName='Dog-Muffin-Labeling-Job'.
        LabelAttributeName='',
        InputConfig={
        'DataSource': {
            'S3DataSource': {
                'ManifestS3Uri': S3_INPUT_URI
            }
        },
        OutputConfig={
            'S3OutputPath': S3_OUTPUT_URI,
        },
        RoleArn=ROLE_ARN,
        LabelCategoryConfigS3Uri=S3_LABELS_URI,
        LabelingJobAlgorithmsConfig={
            'LabelingJobAlgorithmSpecificationArn': 'arn:aws:sagemaker:*region* :027400017018:labeling-job-algorithm-specification/image-classification',
        },
        HumanTaskConfig={
            'WorkteamArn': SM_TEAM_ARN,
            'UiConfig': {
                'UiTemplateS3Uri': S3_WORKERTEMPLATE_URI
            },
            'PreHumanTaskLambdaArn': 'arn:aws:lambda:us-west-2:081040173940:function:PRE-ImageMultiClass',
            'TaskTitle': 'Dog or Muffin',
            'TaskDescription': 'Object Classification',
            'NumberOfHumanWorkersPerDataObject': 1,
            'TaskTimeLimitInSeconds': 3600,
            'AnnotationConsolidationConfig': {
                'AnnotationConsolidationLambdaArn': 'arn:aws:lambda:eu-west-2:487402164563:function:ACS-ImageMultiClass'
            },
        },
        Tags=[
            {
                'Key': 'Job',
                'Value': 'Labeling'
            },
        ]
    )

    print("New Amazon SageMaker notebook instance created.")