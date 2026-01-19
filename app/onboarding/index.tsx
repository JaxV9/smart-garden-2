import { GardenLevelChoice } from "@/components/new/onboarding-form/garden-level-choice/garden-level-choice";
import { GardenLocationInput } from "@/components/new/onboarding-form/garden-location-input/garden-location-input";
import { GardenNameInput } from "@/components/new/onboarding-form/garden-name-input/garden-name-input";
import { OnboardingForm } from "@/components/new/onboarding-form/onboarding-form";
import { useOnboarding } from "@/hooks/useOnboarding";
import { ScrollView, StyleSheet } from "react-native";


export default function Index() {

    const { getTitle, getSubTitle, getIcon, currentStep,
        stepNumber, previousStep, nextStep, setGardenName, setGardenLocation,
        setGardenLevel, canGoForward, confirm, error, gardenName,
        gardenLocation, allInputsFilled, loading } = useOnboarding()


    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <OnboardingForm currentStep={currentStep} stepNumber={stepNumber}
                icon={getIcon()} title={getTitle()} subTitle={getSubTitle()}
                nextStep={nextStep} previousStep={previousStep}
                canGoForward={canGoForward} confirm={confirm} error={error}
                allInputsFilled={allInputsFilled} loading={loading}>
                {currentStep === 0 &&
                    <GardenNameInput gardenName={gardenName} setGardenName={setGardenName} />
                }
                {currentStep === 1 &&
                    <GardenLocationInput gardenLocation={gardenLocation} setGardenLocation={setGardenLocation} />
                }
                {currentStep === 2 &&
                    <GardenLevelChoice setGardenLevel={setGardenLevel} />
                }
            </OnboardingForm>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    contentContainer: {
        paddingTop: 64,
        paddingLeft: 8,
        paddingRight: 8,
        paddingBottom: 50,
        gap: 16,
    }
});