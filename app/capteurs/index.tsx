import { BackButton } from '@/components/new/backButton/backButton';
import { SensorsSection } from '@/components/new/sensors/sensorsSection';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <BackButton callback={() => router.replace('/home')} />
      <SensorsSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    paddingLeft: 8,
    paddingRight: 8,
    gap: 16,
    backgroundColor: '#F9FAFB',
  },
});
