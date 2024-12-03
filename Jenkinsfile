pipeline {
    agent any
    parameters {
        choice(name: 'ACTION', choices: ['normal', 'deploy'], description: 'Choose whether to have normal ci or with deployment')
    }
    environment {
        GOOGLE_APPLICATION_CREDENTIALS = credentials('GCP_KEY') // Use the ID from the stored credentials
        DOCKER_USERNAME = credentials('DOCKER_USERNAME')
        DOCKER_PASSWORD = credentials('DOCKER_PASSWORD')
    }
    stages {
        stage('Authenticate with Google Cloud') {
            when {
                expression { params.ACTION == 'deploy' }
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
                expression { params.ACTION == 'deploy' }
            }
            steps {
                sh 'gcloud container clusters get-credentials dcom-cluster --zone europe-west1-b --project d-com-437216'
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
        stage('Dockerize') {
            when {
                expression { params.ACTION == 'deploy' }
            }
            steps {
                sh 'docker build -t europe-west1-docker.pkg.dev/d-com-437216/cluster-repo/frontend .'
                sh 'docker push europe-west1-docker.pkg.dev/d-com-437216/cluster-repo/frontend'
            }
        }
        stage('Deploy') {
            when {
                expression { params.ACTION == 'deploy' }
            }
            steps {
                sh 'kubectl delete deployment frontend --ignore-not-found=true'
                sh 'kubectl apply -f frontend-deployment.yaml'
            }
        }
    }
}
