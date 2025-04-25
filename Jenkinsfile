pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/Shahrukh-Khan644/Rescue_Path.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm run test'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

    }   

    post {
        always {
            echo 'Pipeline finished.'
        }       
        success {
            echo 'Pipeline successful.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}       

