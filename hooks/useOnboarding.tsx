import { useGardenContext } from "@/contexts/garden.context";
import { GardenerLevel } from "@/models/models";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useFetch } from "./useFetch";
import { useUser } from "./useUser";

export function useOnboarding() {
    const { httpClient } = useFetch(undefined)
    const { getUser } = useUser()

    const { updateGardenInfo } = useGardenContext();

    const [gardenName, setGardenName] = useState<string | undefined>(undefined)
    const [gardenLocation, setGardenLocation] = useState<string | undefined>(undefined);
    const [gardenLevel, setGardenLevel] = useState<GardenerLevel | undefined>(undefined);

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false);

    const [currentStep, setCurrentStep] = useState<number>(0);
    const [stepNumber, setStepNumber] = useState<number[]>([...Array(3).keys()]);
    const [canGoForward, setCanGoForward] = useState<boolean>(false);
    const [allInputsFilled, setAllInputsFilled] = useState<boolean>(false);

    async function confirm(): Promise<void> {
        setError(false)
        setLoading(true)
        const http = await httpClient
        const payload = {
            level: gardenLevel,
            gardenName: gardenName,
            gardenLocation: gardenLocation
        };
        const response = await http.post('/api/onboarding', payload);
        if (response.status !== 'Failure') {
            await getUser()
            setLoading(false)

            updateGardenInfo({
                name: gardenName ?? null,
                location: gardenLocation ?? null,
            });

            router.push('/')
            return
        }
        setError(true)
        setLoading(false)
    }

    function getTitle() {
        switch (currentStep) {
            case 0:
                return 'Donnez un nom à votre jardin';
            case 1:
                return 'Où se trouve votre jardin ?';
            case 2:
                return 'Quel est votre niveau ?';
        }
        return ''
    }

    function getSubTitle() {
        switch (currentStep) {
            case 0:
                return 'Personnalisez votre espace de jardinage'
            case 1:
                return 'Cela nous aidera à vous donner des conseils adaptés à votre climat'
            case 2:
                return 'Cela nous permettra d\'adapter nos recommandations';
        }
        return ''
    }

    function getIcon(): string {
        switch (currentStep) {
            case 0:
                return require('@/assets/icons/leafSolid.svg');
            case 1:
                return require('@/assets/icons/location.svg');
            case 2:
                return require('@/assets/icons/plant.svg');
        }
        return ''
    }

    function nextStep() {
        if (currentStep !== stepNumber.length - 1 && currentInputIsfilled()) {
            setCurrentStep(currentStep + 1)
        }
    }

    function previousStep() {
        if (currentStep !== 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    function currentInputIsfilled(): boolean {
        switch (currentStep) {
            case 0:
                return gardenName !== undefined && gardenName.trim().length > 0;
            case 1:
                return gardenLocation !== undefined && gardenLocation.trim().length > 0;
            case 2:
                return gardenLevel !== undefined;
            default:
                return false;
        }
    }

    useEffect(() => {
        if (gardenName === '') {
            setGardenName(undefined)
        }
    }, [gardenName])

    useEffect(() => {
        if (gardenLocation === '') {
            setGardenLocation(undefined)
        }
    }, [gardenLocation])

    useEffect(() => {
        setCanGoForward(currentInputIsfilled())
    }, [currentStep, gardenName, gardenLocation, gardenLevel])

    useEffect(() => {
        setAllInputsFilled(
            gardenName !== undefined && gardenName.trim().length > 0 &&
            gardenLocation !== undefined && gardenLocation.trim().length > 0 &&
            gardenLevel !== undefined
        )
    }, [gardenName, gardenLocation, gardenLevel])

    return {
        getTitle,
        getSubTitle,
        getIcon,
        nextStep,
        previousStep,
        currentStep,
        stepNumber,
        gardenName,
        setGardenName,
        setGardenLocation,
        setGardenLevel,
        canGoForward,
        loading,
        confirm,
        error,
        allInputsFilled
    };
}
