run:
	npx expo start

build-android:
	eas build --platform android --profile preview-apk

build-ios:
	eas build --platform android --profile preview-ios