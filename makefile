run:
	npx expo start

build-android:
	eas build --platform android --profile preview-apk

build-ios:
	eas build --platform android --profile preview-ios

build-aab:
	cd android && gradlew bundleRelease

build-apk:
	cd android && gradlew assembleRelease

prebuild:
	npx expo prebuild

prebuild-clean:
	npx expo prebuild --clean