import { SensorsSection } from '@/components/new/sensors/sensorsSection';
import AppHeader from '@/components/new/ui/AppHeader';
import { StyleSheet, View } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <AppHeader
        title="Capteurs"
        showBack={true}
        fallbackRoute="/home"
      />

      <SensorsSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});