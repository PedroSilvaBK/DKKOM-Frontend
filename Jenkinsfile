pipeline {
    agent any
    parameters {
        choice(name: 'ACTION', choices: ['normal', 'deploy-prod', 'deploy-staging'], description: 'Choose whether to have normal ci or with deployment')
    }
    environment {
        GOOGLE_APPLICATION_CREDENTIALS = credentials('GCP_KEY') // Use the ID from the stored credentials
        DOCKER_USERNAME = credentials('DOCKER_USERNAME')
        DOCKER_PASSWORD = credentials('DOCKER_PASSWORD')
        SNYK_TOKEN = credentials('SNYK_TOKEN')
    }
    stages {
        stage('Authenticate with Google Cloud') {
            when {
                expression { params.ACTION == 'deploy-prod' || params.ACTION == 'deploy-staging' }
            }
            steps {
                script {
                    sh 'echo $GOOGLE_APPLICATION_CREDENTIALS > gcloud-key.json'
                    sh '''
                        gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
                    '''
                }
            }
        }
        stage('Get Cluster Credentials') {
            when {
                expression { params.ACTION == 'deploy-prod' || params.ACTION == 'deploy-staging' }
            }
            steps {
                sh 'gcloud container clusters get-credentials dcom-cluster --zone europe-west1-b --project dkkom-446515'
            }
        }
        stage('Build frontend') {
            steps {
                sh 'docker login --username $DOCKER_USERNAME --password $DOCKER_PASSWORD'
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('Snyk Scan Frontend') {
            agent {
                label 'snyk-agent'
            }
            steps {
                sh 'ls -la'
                sh 'snyk auth $SNYK_TOKEN'
                sh 'snyk test --all-projects'
            }
        }
        stage('Dockerize Production') {
            when {
                expression { params.ACTION == 'deploy-prod' }
            }
            steps {
                sh 'docker build -f Dockerfile-prod -t europe-west1-docker.pkg.dev/dkkom-446515/cluster-repo/frontend:latest .'
                sh 'docker push europe-west1-docker.pkg.dev/dkkom-446515/cluster-repo/frontend:latest'
            }
        }
        stage('Deploy Production') {
            when {
                expression { params.ACTION == 'deploy-prod' }
            }
            steps {
                sh '''
                    helm upgrade --install frontend ./frontend-helm \
                        -f ./frontend-helm/values.yaml
                    '''
            }
        }
        stage('Dockerize Staging') {
            when {
                expression { params.ACTION == 'deploy-staging' }
            }
            steps {
                sh 'docker build -f Dockerfile-staging -t europe-west1-docker.pkg.dev/dkkom-446515/cluster-repo/frontend:staging .'
                sh 'docker push europe-west1-docker.pkg.dev/dkkom-446515/cluster-repo/frontend:staging'
            }
        }
        stage('Deploy Staging') {
            when {
                expression { params.ACTION == 'deploy-staging' }
            }
            steps {
                sh '''
                    helm upgrade --install frontend-staging ./frontend-helm \
                        -f ./frontend-helm/values=staging.yaml
                    '''
            }
        }
    }
}
