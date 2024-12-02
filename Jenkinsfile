pipeline {
    agent any
    environment {
        GOOGLE_APPLICATION_CREDENTIALS = credentials('GCP_KEY') // Use the ID from the stored credentials
    }
    stages {
        stage('Authenticate with Google Cloud') {
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
            steps {
                sh 'gcloud container clusters get-credentials dcom-cluster --zone europe-west1-b --project d-com-437216'
            }
        }
        stage('Build frontend') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('Dockerize') {
            steps {
                sh 'docker build -t europe-west1-docker.pkg.dev/d-com-437216/cluster-repo/frontend .'
                sh 'docker push europe-west1-docker.pkg.dev/d-com-437216/cluster-repo/frontend'
            }
        }
        stage('Deploy') {
            steps {
                sh 'kubectl apply -f k8s/frontend-deployment.yaml'
            }
        }
    }
}
