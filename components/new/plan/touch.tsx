import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, PanResponder, StyleSheet } from "react-native";

interface TouchProps {
    scale: number,
    children: React.ReactNode,
    isAbsolute: boolean,
}

export const Touch = ({ scale, children, isAbsolute }: TouchProps) => {

    const pan = useRef(new Animated.ValueXY()).current;
    const animatedScale = useRef(new Animated.Value(scale)).current;
    const [childSize, setChildSize] = useState({ width: 0, height: 0 });
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (isAbsolute) {
            pan.setValue({ x: -25000 + 200, y: -25000 + 200 });
        } else if (childSize.width > 0 && childSize.height > 0 && !isInitialized) {
            pan.setValue({
                x: 25000 - (childSize.width / 2),
                y: 25000 - (childSize.height / 2) + 180
            });
            setIsInitialized(true);
        }
    }, [isAbsolute, pan, childSize, isInitialized]);

    useEffect(() => {
        Animated.timing(animatedScale, {
            toValue: scale,
            duration: 200,
            useNativeDriver: false
        }).start();
    }, [scale, animatedScale]);

    const panResponder = useMemo(
        () => PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onStartShouldSetPanResponderCapture: () => false,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
            },
            onMoveShouldSetPanResponderCapture: (_, gestureState) => {
                if (!isAbsolute) {
                    return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
                }
                return false;
            },
            onPanResponderGrant: () => {
                pan.setOffset({
                    x: (pan.x as any)._value,
                    y: (pan.y as any)._value
                });
            },
            onPanResponderMove: Animated.event(
                [
                    null,
                    { dx: pan.x, dy: pan.y }
                ],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: () => {
                pan.flattenOffset();
            }
        }),
        [pan, isAbsolute]
    );
    return (
        <Animated.View
            style={[
                isAbsolute === true ? styles.globalArea : styles.area,
                {
                    transform: [
                        { translateX: pan.x },
                        { translateY: pan.y },
                        { scale: animatedScale }
                    ]
                }
            ]}
            {...panResponder.panHandlers}
            onLayout={(event) => {
                if (!isAbsolute) {
                    const { width, height } = event.nativeEvent.layout;
                    setChildSize({ width, height });
                }
            }}
        >
            {children}
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    area: {
        width: 'auto',
        height: 'auto',
        alignSelf: 'flex-start',
    },
    globalArea: {
        width: 50000,
        height: 50000,
        backgroundColor: 'transparent',
    }
});