pipeline {
    agent any
    environment {
        AWS_CREDS = 'aws-jenkins-creds' 
        S3_BUCKET = 'my-static-website-bucket-jmo-2025'
        REGION = 'us-east-1'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/johnmicky1/lms-static-website.git'
            }
        }
        stage('Build') {
            steps {
                // Add your build commands here if needed
                sh 'echo "Building the website..."'
            }
        }
        stage('Test') {
            steps {
                // Add your test commands here if needed
                sh 'echo "Testing the website..."'
            }
        }
        stage('Deploy to S3') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: "${AWS_CREDS}"]]) {
                    sh '''
                        aws configure set aws_access_key_id $AKIAQWPI74S3Q2MBVSY2
                        aws configure set aws_secret_access_key $+7vT10hHuX8a1/N+iS4RHY6INA9TxrBEx+OHOGMn
                        aws configure set region ${REGION}
                        aws s3 sync . s3://${S3_BUCKET}/ --delete --acl public-read
                    '''
                }
            }
        }
    }
    post {
        success {
            echo "Deployment Successful"
        }
        failure {
            echo "Deployment Failed"
        }
    }
}