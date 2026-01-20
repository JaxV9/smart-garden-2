import { Pressable, StyleSheet, Text, View } from "react-native";

interface ZoomProps {
    scale: number,
    setScale: React.Dispatch<React.SetStateAction<number>>,
}

export const ZoomItem = ({ scale, setScale }: ZoomProps) => {

    function zoomOut(): void {
        const currentScale = parseFloat(scale.toFixed(1));
        if (currentScale === 0.5) return
        setScale(scale - 0.1)
    }

    function zoomIn(): void {
        const currentScale = parseFloat(scale.toFixed(1));
        if (currentScale === 1.5) return
        setScale(scale + 0.1)
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerElement}>
                <View style={styles.areaManager}>
                    <Pressable onPress={() => zoomOut()} style={styles.setterBtn}>
                        <Text style={styles.btnLabel}>-</Text>
                    </Pressable>
                    <Text style={styles.label}>Zoom {Math.trunc(scale * 100)} %</Text>
                    <Pressable onPress={() => zoomIn()} style={styles.setterBtn}>
                        <Text style={styles.btnLabel}>+</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 16,
        textAlign: 'center',
        position: 'absolute',
        bottom: 42,
        left: '20%',
        borderWidth: 1,
        width: '60%',
        padding: 16,
        borderRadius: 16,
        borderColor: '#9c9a9774',
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        margin: 'auto',
        fontSize: 18,
        fontWeight: 600
    },
    label: {
        fontSize: 16
    },
    headerElement: {
        alignItems: 'center',
        gap: 8
    },
    setterBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dfe2e6ff',
        width: 32,
        height: 32,
        borderRadius: '50%'
    },
    btnLabel: {
        fontSize: 20,
        marginTop: -2
    },
    areaManager: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
});