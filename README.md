# DrumScribe

DrumScribe is a mobile application built with React Native, featuring a Django 
backend. It allows users to generate drum tracks by uploading an audio file.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them:

- Node.js and npm
- React Native CLI
- Python 3 and pip
- CocoaPods (for iOS development)
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installing

A step by step series of examples that tell you how to get a development environment running:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/iturner72/DrumScribe.git
   cd DrumScribe
   ```

2. **Set up the React Native app:**
   ```bash
   cd client
   npm install
   ```

   For iOS:
   ```bash
   cd ios
   pod install
   cd ..
   npx react-native run-ios
   ```

   For Android:
   ```bash
   npx react-native run-android
   ```

3. **Set up the Django backend:**
   ```bash
   cd server
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

