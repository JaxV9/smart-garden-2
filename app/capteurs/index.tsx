import { BackButton } from '@/components/new/backButton/backButton';
import { SensorsSection } from '@/components/new/sensors/sensorsSection';
import { Header } from '@/components/new/header/header';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header />
      </View>
      <View style={styles.backButtonRow}>
        <BackButton callback={() => router.replace('/home')} />
      </View>
      <SensorsSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    backgroundColor: '#F9FAFB',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButtonRow: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
});
