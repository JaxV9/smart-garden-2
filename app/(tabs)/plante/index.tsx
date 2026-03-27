import { VegetableCard } from '@/components/new/vegetablesList/vegetable/vegetable';
import { VegetablesList } from '@/components/new/vegetablesList/vegetableList';
import { useVegetablesContext } from '@/contexts/vegetables.context';
import { useVegetable } from '@/hooks/useVegetable';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Header  } from "@/components/new/header/header";

export default function Index() {
  const { vegetablesContext } = useVegetablesContext();
  const { loadVegetables } = useVegetable();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (vegetablesContext.length === 0) {
      loadVegetables();
    }
  }, [vegetablesContext.length]);

  const filteredVegetables = useMemo(() => {
    return vegetablesContext.filter((vegetable) =>
      vegetable.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, vegetablesContext]);

  return (
    <View style={styles.screen}>
      <Header/>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Rechercher"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>

        <VegetablesList>
          {filteredVegetables.map((vegetable) => (
            <VegetableCard
              key={vegetable.id}
              vegetable={vegetable}
              callBack={() => router.push(`/vegetable/${vegetable.id}`)}
            />
          ))}
        </VegetablesList>

        {filteredVegetables.length === 0 && (
          <Text style={styles.empty}>Aucune plante trouvée.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 14,
  },

  searchBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  empty: {
    marginTop: 20,
    textAlign: 'center',
    color: '#6B7280',
  },
});
