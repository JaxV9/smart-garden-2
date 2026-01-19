import { Image } from "expo-image";
import React from "react";
import { ActivityIndicator, Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingFormProps {
    currentStep: number,
    stepNumber: number[],
    icon: string,
    title: string,
    subTitle: string,
    children: React.ReactNode,
    nextStep: () => void,
    previousStep: () => void,
    canGoForward: boolean,
    allInputsFilled: boolean,
    loading: boolean,
    confirm: () => void,
    error: boolean
}

export function OnboardingForm({
    currentStep, stepNumber, icon, title, subTitle, children, nextStep, previousStep,
    canGoForward, allInputsFilled, error, confirm, loading
}: OnboardingFormProps) {

    function stepIsActive(step: number): boolean {
        return step <= currentStep;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require('@/assets/icons/leaf.svg')}
                    style={{ width: 28, height: 28, margin: 'auto' }}
                />
                <Text style={styles.headerText}>Configurons votre jardin en quelques étapes :</Text>
            </View>
            <View style={[styles.gap24, styles.marginBot8]}>
                <View style={styles.stepsContainer}>
                    {stepNumber.map((step, index) => (
                        <View key={index} style={[styles.step,
                        stepIsActive(step) ? styles.stepActive : styles.stepInactive
                        ]}></View>
                    ))}
                </View>
                {error &&
                    <Text style={styles.title}>Erreur</Text>
                }

                <Image
                    source={icon}
                    style={[{ width: 64, height: 64 }, styles.leafIcon]}
                />
                <View style={styles.gap8}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subTitle}>{subTitle}</Text>
                </View>
            </View>
            {children}
            <View style={styles.formBtn}>
                {currentStep === stepNumber.length - 1 &&
                    <Pressable onPress={confirm}
                        disabled={!allInputsFilled} style={[styles.nextBtn, allInputsFilled ? styles.btnEnabled : styles.btnDisabled]}>
                        {
                            loading ?
                                <ActivityIndicator color="#fff" />
                                :
                                <Text style={styles.textNextBtn}>Commencer</Text>
                        }
                    </Pressable>
                }
                {currentStep !== stepNumber.length - 1 &&
                    <Pressable onPress={nextStep}
                        disabled={!canGoForward} style={[styles.nextBtn, canGoForward ? styles.btnEnabled : styles.btnDisabled]}>
                        <Text style={styles.textNextBtn}>Suivant</Text>
                    </Pressable>
                }
                {currentStep !== 0 &&
                    <Pressable onPress={previousStep} style={styles.previousBtn}>
                        <Text style={styles.textPreviousBtn}>Précédent</Text>
                    </Pressable>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        minHeight: SCREEN_HEIGHT * 0.8,
        height: 'auto',
        margin: 'auto',
        marginTop: 16,
        backgroundColor: 'white',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        paddingBottom: 16,
    },
    header: {
        width: '100%',
        height: 'auto',
        backgroundColor: '#5B8E55',
        padding: 24,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        flexDirection: 'row',
        gap: 16
    },
    gap8: {
        gap: 8
    },
    gap24: {
        gap: 24
    },
    marginBot8: {
        marginBottom: 8
    },
    headerText: {
        color: 'white',
        fontWeight: 500,
        fontSize: 16,
        flex: 1,
        flexShrink: 1,
    },
    stepsContainer: {
        width: '80%',
        height: 8,
        gap: 16,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 50,
        flexDirection: 'row',
    },
    step: {
        width: '100%',
        height: '100%',
        flexShrink: 1,
        borderRadius: 2
    },
    stepActive: {
        backgroundColor: '#5B8E55',
    },
    stepInactive: {
        backgroundColor: '#E5E7EB',
    },
    leafIcon: {
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    title: {
        fontWeight: 500,
        textAlign: 'center',
        fontSize: 16
    },
    subTitle: {
        color: '#4A5565',
        textAlign: 'center',
        fontSize: 14
    },
    previousBtn: {
        borderColor: '#5B8E55',
        borderWidth: 2,
        width: '100%',
        alignSelf: 'center',
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 4,
        marginTop: 8
    },
    nextBtn: {
        width: '100%',
        alignSelf: 'center',
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 4
    },
    btnEnabled: {
        backgroundColor: '#5B8E55',
    },
    btnDisabled: {
        backgroundColor: '#5b8e5579',
    },
    textNextBtn: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center'
    },
    textPreviousBtn: {
        color: '#5B8E55',
        fontSize: 20,
        textAlign: 'center'
    },
    formBtn: {
        marginTop: 'auto',
        borderTopWidth: 1,
        borderTopColor: '#00000016',
        paddingTop: 16,
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
    }
});
