run:
	npx expo start

build-android:
	eas build --platform android --profile preview-apk

build-ios:
	eas build --platform android --profile preview-ios

# Expo build prebuild for native files (required for IAP)
prebuild:
	npx expo prebuild

# Expo build prebuild --clean for native files (required for IAP)
prebuild-clean:
	npx expo prebuild --clean

# Android official build aab for play store
build-aab:
	cd android && gradlew bundleRelease

# Android official build apk for testing (local install)
build-apk:
	cd android && gradlew assembleRelease