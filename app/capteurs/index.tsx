import { SensorsSection } from '@/components/new/sensors/sensorsSection';
import AppHeader from '@/components/new/ui/AppHeader';
import { StyleSheet, View } from 'react-native';
import { useTour } from '@/contexts/tour.context';
import React, { useRef } from 'react';

export default function Index() {
  const { registerElement } = useTour();
  const sensorsRef = useRef<View>(null);

  const handleOnLayout = () => {
    setTimeout(() => {
      sensorsRef.current?.measureInWindow((x, y, w, h) => {
        if (w && h) {
          registerElement('sensors_main', { x, y, width: w, height: h });
        }
      });
    }, 200);
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Capteurs"
        showBack={true}
        fallbackRoute="/home"
      />

      <View 
        ref={sensorsRef}
        onLayout={handleOnLayout}
        style={{ flex: 1 }}
      >
        <SensorsSection />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});