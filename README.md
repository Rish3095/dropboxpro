# dropboxpro

CMPE 281 Project 1
Professor Sanjay Garje
Sudent: Rishabh Gupta
SJSU ID: 010013666

Assignment Details:
* This is a highly available and highly scalable web application which would be accessible via a registered domain name.
* It allows authorized users to perform following operations:
    * Upload new files
    * Search existing files that are already uploaded
    * Update files by re-uploadging them with new information.
    * Delete files that are uploaded by the user
* For all the uploaded files, we can view: User name, upload time, updated time, description
* Download the file leveraging clloudfront
* The architecture diagram showing the system design
* Possible aws services::
    * EC2, ELB, Lambda, AutoScaling Group, Single AZ RDS, CloudFront, S3, S3 Transfer Acceleration, R53, CloudWatch, SNS
* Multi-AZ and multi-region selected.
* admin access of all the files from all the users
* API driven backend 
* Alarms setup using SNS and cloudwatch to monitor any possible failures
* Cost effective solution since cloudfront is used and edge locations can be leveraged when accessing the website from different parts of the world.
* Set up code pipeline one for dev and one for production and show the CI/CD code, build, test and promotion of code.
* Authentication setup using AWS cognito
