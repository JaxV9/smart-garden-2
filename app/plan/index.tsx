import { Plan } from "@/components/new/plan/plan";
import AppHeader from "@/components/new/ui/AppHeader";
import { StyleSheet, View } from "react-native";
import { useTour } from "@/contexts/tour.context";
import React, { useRef } from "react";

export default function Index() {
    const { registerElement } = useTour();
    const planRef = useRef<View>(null);

    const handleOnLayout = () => {
        setTimeout(() => {
            planRef.current?.measureInWindow((x, y, w, h) => {
                if (w && h) {
                    registerElement('plan_grid', { x, y, width: w, height: h });
                }
            });
        }, 200);
    };

    return (
        <View style={styles.container}>
            <View 
                ref={planRef}
                onLayout={handleOnLayout}
                style={{ flex: 1 }}
            >
                <Plan />
            </View>
            <View style={styles.headerContainer}>
                <AppHeader
                    title="Plan"
                    showBack={true}
                    showNotifications={true}
                    fallbackRoute="/home"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },
});