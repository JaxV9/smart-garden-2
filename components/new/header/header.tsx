import { useGardenContext } from '@/contexts/garden.context';
import { StyleSheet, Text } from 'react-native';

interface HeaderProps {
  text?: string;
}

export function Header({ text }: HeaderProps) {
  const { gardenInfo } = useGardenContext();
  
  const titleText = text !== undefined ? text : (gardenInfo.name ?? 'Mon Jardin');

  return (
    <Text style={styles.text}>{titleText}</Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#5B8E55',
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 28,
  },
});
