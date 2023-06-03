import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration: number = 300;
const s3 = new XAWS.S3({ signatureVersion: 'v4' });

export async function getPresignedAttachmentUrl(todoId: string): Promise<string> {
    const signedUrl = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: todoId,
      Expires: urlExpiration
    });
  
    return signedUrl
  }