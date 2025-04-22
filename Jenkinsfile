pipeline {
    agent any

    environment {
	NODE_ENV = 'development'
    }

    stages {
	stage('Checkout') {
	    steps {
		checkout scm
	    }
	}

	stage('Install Dependencies') {
	    steps {
		echo 'Installing Dependencies...'
		sh 'npm install'
	    }
	}

	stage('Lint') {
	    steps {
		echo 'Running Lint...'
		sh 'npm run lint || true'
	    }
	}

	stage('Test') {
	    steps {
		echo 'Running Tests...'
		sh 'npm run test'
	    }
	}

	stage('Build') {
	    steps {
		echo 'Running Build...'
		sh 'npm run build'
	    }
	}
    }

    post {
        success {
            echo '✅ All steps completed successfully!'
        }
        failure {
            echo '❌ Build failed. Please check the logs above.'
        }
    }
}

