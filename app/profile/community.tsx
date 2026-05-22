import { useUserContext } from '@/contexts/user.context';
import { useForum } from '@/hooks/useForum';
import { useSocial } from '@/hooks/useSocial';
import { useTutorials } from '@/hooks/useTutorials';
import { useUser } from '@/hooks/useUser';
import { getTimeAgo } from '@/utils/dateFormatter';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DEFAULT_AVATAR = require('@/assets/images/avatar.png');

interface UnifiedInteraction {
  id: string;
  type: 'publication' | 'commentaire';
  category: 'social' | 'forum' | 'tuto';
  title?: string;
  content: string;
  createdAt: string;
  tag?: string;
  authorName: string;
  commentsCount?: number;
  likesCount?: number;
  viewsCount?: number;
  parentTopicTitle?: string;
}

export default function CommunityProfileScreen() {
  const { user } = useUserContext();
  const { updateUser } = useUser();
  const { getUserPosts } = useSocial();
  const { getUserTopics, getUserComments } = useForum();
  const { getUserTutorials } = useTutorials();

  const displayName = user?.publicName || user?.name || '';
  const avatarSource = user?.avatarUri ? { uri: user.avatarUri } : DEFAULT_AVATAR;

  const [loading, setLoading] = useState(true);
  const [rawInteractions, setRawInteractions] = useState<UnifiedInteraction[]>([]);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [appliedTypes, setAppliedTypes] = useState<string[]>([]);
  const [appliedCategories, setAppliedCategories] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [posts, topics, comments, tutorials] = await Promise.all([
        getUserPosts(),
        getUserTopics(),
        getUserComments(),
        getUserTutorials(),
      ]);

      const items: UnifiedInteraction[] = [];

      posts.forEach((post: any) => {
        items.push({
          id: post.id,
          type: 'publication',
          category: 'social',
          content: post.content,
          createdAt: post.createdAt,
          authorName: post.author?.name || displayName,
          likesCount: post._count?.likes || 0,
          commentsCount: post._count?.comments || 0,
          viewsCount: post.viewCount || 0,
        });
      });

      topics.forEach((topic: any) => {
        items.push({
          id: topic.id,
          type: 'publication',
          category: 'forum',
          title: topic.title,
          content: topic.content,
          createdAt: topic.createdAt,
          tag: topic.tags?.[0]?.tag?.name || 'Forum',
          authorName: topic.author?.name || displayName,
          commentsCount: topic._count?.comments || 0,
          viewsCount: topic.viewCount || 0,
        });
      });

      comments.forEach((comment: any) => {
        items.push({
          id: comment.id,
          type: 'commentaire',
          category: 'forum',
          content: comment.content,
          createdAt: comment.createdAt,
          authorName: comment.author?.name || displayName,
          parentTopicTitle: comment.topic?.title || 'Sujet sans titre',
          tag: comment.topic?.tags?.[0]?.tag?.name || 'Réponse',
        });
      });

      tutorials.forEach((tuto: any) => {
        items.push({
          id: tuto.id,
          type: 'publication',
          category: 'tuto',
          title: tuto.title,
          content: tuto.description || '',
          createdAt: tuto.createdAt,
          tag: tuto.category || 'Tutos',
          authorName: tuto.author?.name || displayName,
          likesCount: tuto._count?.likes || 0,
          viewsCount: tuto.viewCount || 0,
        });
      });

      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRawInteractions(items);
    } catch (e) {
      console.error('Error fetching community interactions:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    rawInteractions.forEach((item) => types.add(item.type));
    return Array.from(types);
  }, [rawInteractions]);

  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    rawInteractions.forEach((item) => cats.add(item.category));
    return Array.from(cats);
  }, [rawInteractions]);

  const filteredInteractions = useMemo(() => {
    return rawInteractions.filter((item) => {
      const typeMatches =
        appliedTypes.length === 0 || appliedTypes.includes(item.type);
      const categoryMatches =
        appliedCategories.length === 0 || appliedCategories.includes(item.category);
      return typeMatches && categoryMatches;
    });
  }, [rawInteractions, appliedTypes, appliedCategories]);

  const activeFiltersCount = appliedTypes.length + appliedCategories.length;
  const currentFiltersSelectionCount = selectedTypes.length + selectedCategories.length;

  const openFilters = () => {
    setSelectedTypes([...appliedTypes]);
    setSelectedCategories([...appliedCategories]);
    setIsFilterModalOpen(true);
  };

  const applyFilters = () => {
    setAppliedTypes([...selectedTypes]);
    setAppliedCategories([...selectedCategories]);
    setIsFilterModalOpen(false);
  };

  const resetFilters = () => {
    setSelectedTypes([]);
    setSelectedCategories([]);
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil communautaire</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.userCard}>
          <Image source={avatarSource} style={styles.avatar} />
          <Text style={styles.userName}>{displayName}</Text>

          <View style={styles.privacyRow}>
            <View style={styles.privacyTextGroup}>
              <Feather name={user?.isPrivate ? 'eye-off' : 'eye'} size={16} color={COLORS.textMuted} />
              <Text style={styles.privacyLabel}>Compte privé</Text>
            </View>
            <Switch
              value={user?.isPrivate || false}
              onValueChange={(val) => updateUser({ isPrivate: val })}
              trackColor={{ false: '#e5e5e5', true: COLORS.greenDark }}
              thumbColor={'#ffffff'}
            />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Intéactions</Text>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFiltersCount > 0 && styles.filterButtonActive,
            ]}
            onPress={openFilters}
          >
            <Feather
              name="sliders"
              size={14}
              color={activeFiltersCount > 0 ? '#FFFFFF' : COLORS.greenDark}
            />
            <Text
              style={[
                styles.filterButtonText,
                activeFiltersCount > 0 && styles.filterButtonTextActive,
              ]}
            >
              Filtres{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.greenDark} style={styles.loader} />
        ) : filteredInteractions.length > 0 ? (
          <View style={styles.list}>
            {filteredInteractions.map((item) => (
              <View key={`${item.category}-${item.id}`} style={styles.card}>
                {item.type === 'publication' ? (
                  <View>
                    <View style={styles.cardHeader}>
                      {item.tag && (
                        <View style={styles.tagBadge}>
                          <Text style={styles.tagText}>{item.tag.toUpperCase()}</Text>
                        </View>
                      )}
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>
                          {item.category === 'social'
                            ? 'Social'
                            : item.category === 'forum'
                              ? 'Forum'
                              : 'Tutos'}
                        </Text>
                      </View>
                    </View>

                    {item.title && <Text style={styles.cardTitle}>{item.title}</Text>}
                    <Text style={styles.cardContent} numberOfLines={3}>
                      {item.content}
                    </Text>

                    <Text style={styles.metaText}>
                      Par {item.authorName} • {getTimeAgo(item.createdAt)}
                    </Text>

                    <View style={styles.cardFooter}>
                      {item.commentsCount !== undefined && (
                        <View style={styles.statRow}>
                          <Feather name="message-square" size={14} color={COLORS.textMuted} />
                          <Text style={styles.statText}>
                            {item.commentsCount} réponse{item.commentsCount > 1 ? 's' : ''}
                          </Text>
                        </View>
                      )}
                      {item.likesCount !== undefined && (
                        <View style={styles.statRow}>
                          <Feather name="heart" size={14} color={COLORS.textMuted} />
                          <Text style={styles.statText}>{item.likesCount} j'aime</Text>
                        </View>
                      )}
                      {item.viewsCount !== undefined && (
                        <View style={styles.statRow}>
                          <Feather name="eye" size={14} color={COLORS.textMuted} />
                          <Text style={styles.statText}>{item.viewsCount} vues</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ) : (
                  <View>
                    <View style={styles.cardHeader}>
                      {item.tag && (
                        <View style={[styles.tagBadge, { backgroundColor: '#F3F4F6' }]}>
                          <Text style={[styles.tagText, { color: COLORS.textMuted }]}>
                            {item.tag.toUpperCase()}
                          </Text>
                        </View>
                      )}
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>Réponse</Text>
                      </View>
                    </View>

                    {item.parentTopicTitle && (
                      <Text style={styles.parentTopicTitle}>{item.parentTopicTitle}</Text>
                    )}

                    <Text style={styles.metaTextComment}>
                      Par {item.authorName} • {getTimeAgo(item.createdAt)}
                    </Text>

                    <View style={styles.nestedCommentContainer}>
                      <Text style={styles.arrowIcon}>{"└─>"}</Text>
                      <Text style={styles.commentContent}>{item.content}</Text>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>Aucune interaction trouvée.</Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={isFilterModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsFilterModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Filtres{currentFiltersSelectionCount > 0 ? ` (${currentFiltersSelectionCount})` : ''}
              </Text>
              <TouchableOpacity onPress={() => setIsFilterModalOpen(false)}>
                <Feather name="x" size={22} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {availableTypes.length > 0 && (
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Type de contenu</Text>
                  <View style={styles.filterChipsRow}>
                    {availableTypes.includes('publication') && (
                      <TouchableOpacity
                        style={[
                          styles.filterChip,
                          selectedTypes.includes('publication') && styles.filterChipActive,
                        ]}
                        onPress={() => toggleType('publication')}
                      >
                        <Text
                          style={[
                            styles.filterChipText,
                            selectedTypes.includes('publication') && styles.filterChipTextActive,
                          ]}
                        >
                          Publications
                        </Text>
                      </TouchableOpacity>
                    )}
                    {availableTypes.includes('commentaire') && (
                      <TouchableOpacity
                        style={[
                          styles.filterChip,
                          selectedTypes.includes('commentaire') && styles.filterChipActive,
                        ]}
                        onPress={() => toggleType('commentaire')}
                      >
                        <Text
                          style={[
                            styles.filterChipText,
                            selectedTypes.includes('commentaire') && styles.filterChipTextActive,
                          ]}
                        >
                          Commentaires
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}

              {availableCategories.length > 0 && (
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Catégorie</Text>
                  <View style={styles.filterChipsRow}>
                    {availableCategories.includes('social') && (
                      <TouchableOpacity
                        style={[
                          styles.filterChip,
                          selectedCategories.includes('social') && styles.filterChipActive,
                        ]}
                        onPress={() => toggleCategory('social')}
                      >
                        <Text
                          style={[
                            styles.filterChipText,
                            selectedCategories.includes('social') && styles.filterChipTextActive,
                          ]}
                        >
                          Social
                        </Text>
                      </TouchableOpacity>
                    )}
                    {availableCategories.includes('forum') && (
                      <TouchableOpacity
                        style={[
                          styles.filterChip,
                          selectedCategories.includes('forum') && styles.filterChipActive,
                        ]}
                        onPress={() => toggleCategory('forum')}
                      >
                        <Text
                          style={[
                            styles.filterChipText,
                            selectedCategories.includes('forum') && styles.filterChipTextActive,
                          ]}
                        >
                          Forum
                        </Text>
                      </TouchableOpacity>
                    )}
                    {availableCategories.includes('tuto') && (
                      <TouchableOpacity
                        style={[
                          styles.filterChip,
                          selectedCategories.includes('tuto') && styles.filterChipActive,
                        ]}
                        onPress={() => toggleCategory('tuto')}
                      >
                        <Text
                          style={[
                            styles.filterChipText,
                            selectedCategories.includes('tuto') && styles.filterChipTextActive,
                          ]}
                        >
                          Tutos
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalResetButton}
                activeOpacity={0.7}
                onPress={resetFilters}
              >
                <Text style={styles.modalResetButtonText}>Réinitialiser</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalApplyButton}
                activeOpacity={0.8}
                onPress={applyFilters}
              >
                <Text style={styles.modalApplyButtonText}>Appliquer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const COLORS = {
  background: '#F9FAFB',
  greenDark: '#2F6F3A',
  greenLightBg: '#EAF4E7',
  textDark: '#111827',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  cardBg: '#FFFFFF',
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  userCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: COLORS.greenLightBg,
    marginBottom: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 20,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  privacyTextGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  privacyLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textDark,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.greenLightBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: COLORS.greenDark,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.greenDark,
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  loader: {
    marginTop: 40,
  },
  list: {
    gap: 16,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tagBadge: {
    backgroundColor: COLORS.greenLightBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.greenDark,
    letterSpacing: 0.5,
  },
  categoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 8,
    lineHeight: 22,
  },
  cardContent: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 20,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  metaTextComment: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  parentTopicTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  nestedCommentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.greenDark,
  },
  arrowIcon: {
    fontSize: 14,
    color: COLORS.greenDark,
    fontWeight: 'bold',
    marginRight: 6,
  },
  commentContent: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  modalScroll: {
    marginBottom: 24,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  filterChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  filterChipActive: {
    backgroundColor: COLORS.greenLightBg,
    borderWidth: 1,
    borderColor: COLORS.greenDark,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  filterChipTextActive: {
    color: COLORS.greenDark,
    fontWeight: '600',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalResetButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalResetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  modalApplyButton: {
    flex: 1.5,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.greenDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalApplyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
