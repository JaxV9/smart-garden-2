import { GardenerLevel } from "@/models/models";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface GardenLevelChoiceProps {
    setGardenLevel: React.Dispatch<React.SetStateAction<GardenerLevel | undefined>>
}

interface Level {
    level: GardenerLevel,
    title: string,
    subTitle: string,
    icon: string
}

export function GardenLevelChoice({ setGardenLevel }: GardenLevelChoiceProps) {

    const [levelSelected, setLevelSelected] = useState<Level | undefined>(undefined)

    const levels: Level[] = [
        { level: 'beginner', title: 'Débutant.e', subTitle: 'Je découvre le jardinage', icon: '🌱' },
        { level: 'amateur', title: 'Amateur.trice', subTitle: 'J\'ai quelques bases', icon: '🌿' },
        { level: 'advanced', title: 'Avancé.e', subTitle: 'Je pratique régulièrement', icon: '🌳' },
        { level: 'enthusiast', title: 'Passionné.e', subTitle: 'Expert en jardinage', icon: '🌺' },
    ]

    function selectLevel(level: Level): void {
        if (levelSelected === level) {
            return setLevelSelected(undefined)
        }
        setLevelSelected(level);
    }

    useEffect(() => {
        setGardenLevel(levelSelected?.level)
    }, [levelSelected])

    return (
        <View style={styles.container}>
            {levels.map((level, index) => (
                <Pressable onPress={() => selectLevel(level)} key={index} style={[
                    styles.choiceContainer, levelSelected?.level === level.level && styles.choose
                ]}>
                    <Text style={styles.icon}>{level.icon}</Text>
                    <View>
                        <Text style={styles.title}>{level.title}</Text>
                        <Text style={styles.subTitle}>{level.subTitle}</Text>
                    </View>
                </Pressable>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 16,
        width: '90%',
        margin: 'auto',
    },
    choiceContainer: {
        borderColor: '#E5E7EB',
        borderWidth: 2,
        padding: 16,
        borderRadius: 8,
        flexDirection: 'row',
        gap: 16
    },
    choose: {
        backgroundColor: '#61b45844',
        borderColor: '#61B458'
    },
    title: {
        fontSize: 16,
        color: '#0A0A0A'
    },
    subTitle: {
        fontSize: 14,
        color: '#4A5565'
    },
    icon: {
        fontSize: 30,
        marginTop: 'auto',
        marginBottom: 'auto'
    }
});
