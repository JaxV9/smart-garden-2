import { StyleSheet, Text } from "react-native";

interface TitleProps {
    text: string
}

export function Title({ text }: TitleProps) {

    return (
        <Text style={styles.text}>{text}</Text>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        fontWeight: 500
    }
});