import { useTranslation } from '@/contexts/language.context';
import { Vegetable } from '@/models/models';
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type VegetableProps = {
    vegetable: Vegetable,
    callBack: () => unknown
}

const getScientificName = (vegetable: Vegetable) => {
    const spec = vegetable?.specifications?.find((s: string) =>
        s?.toLowerCase?.().includes('nom scientifique')
    );
    if (!spec) return '';

    const parts = spec.split(':');
    return (parts[1] ?? '').trim();
};

const getDifficultyStyle = (difficulty?: string) => {
    const d = (difficulty ?? '').toLowerCase();
    if (d.includes('facile')) return styles.badgeEasy;
    if (d.includes('moy')) return styles.badgeMedium;
    if (d.includes('diffic')) return styles.badgeHard;
    return styles.badgeNeutral;
};

export const VegetableCard = ({ vegetable, callBack }: VegetableProps) => {
    const { t } = useTranslation();
    const rawUri = (vegetable?.images?.[0] as unknown as string) ?? '';
    // Supabase paths sometimes end up with double slashes like "/garden//tomate.png" which can 404.
    const imageUri = rawUri ? rawUri.replace(/([^:]\/\/+)\/+/g, '$1') : '';

    const scientificName = getScientificName(vegetable);
    const difficulty = vegetable?.difficulty ?? '';
    const watering = (vegetable as any)?.watering ?? '';
    const sunExposure = (vegetable as any)?.sun_exposure ?? '';

    return (
        <TouchableOpacity onPress={callBack} style={styles.card} activeOpacity={0.9}>
            <View style={styles.imageWrapper}>
                {!!imageUri && (
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.image}
                        resizeMode="cover"
                        onError={(e) => {
                            console.log('Image load error:', imageUri, e?.nativeEvent);
                        }}
                    />
                )}

                {!!difficulty && (
                    <View style={[styles.badge, getDifficultyStyle(difficulty)]}>
                        <Text style={styles.badgeText}>{t('diff_' + difficulty.toLowerCase(), difficulty)}</Text>
                    </View>
                )}
            </View>

            <View style={styles.body}>
                <Text style={styles.name}>{t('veg_name_' + vegetable.id, vegetable.name)}</Text>
                {!!scientificName && (
                    <Text style={styles.scientific}>{scientificName}</Text>
                )}

                {!!difficulty && (
                    <Text style={styles.snippet}>{t('doc_filter_difficulty') || 'Difficulté'} : {t('diff_' + difficulty.toLowerCase(), difficulty)}</Text>
                )}

                <View style={styles.metaRow}>
                    {!!watering && (
                        <View style={[styles.metaItem, styles.waterPill]}>
                            <Ionicons name="water-outline" size={14} color="#2563EB" />
                            <Text style={styles.metaText}>{t('water_' + watering.toLowerCase(), watering)}</Text>
                        </View>
                    )}

                    {!!sunExposure && (
                        <View style={[styles.metaItem, styles.sunPill]}>
                            <Ionicons name="sunny-outline" size={14} color="#F59E0B" />
                            <Text style={styles.metaText}>{t('sun_' + sunExposure.replace(/\s+/g, '_').toLowerCase(), sunExposure)}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#EEF2F7',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 18,
        elevation: 2,
    },

    imageWrapper: {
        width: '100%',
        height: 180,
        backgroundColor: '#F3F4F6',
        position: 'relative',
    },

    image: {
        width: '100%',
        height: '100%',
    },

    badge: {
        position: 'absolute',
        top: 10,
        right: 10,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
    },

    badgeText: {
        fontSize: 12,
        fontWeight: '700',
    },

    badgeEasy: {
        backgroundColor: '#ECFDF5',
        borderColor: '#A7F3D0',
    },

    badgeMedium: {
        backgroundColor: '#FFFBEB',
        borderColor: '#FDE68A',
    },

    badgeHard: {
        backgroundColor: '#FEF2F2',
        borderColor: '#FECACA',
    },

    badgeNeutral: {
        backgroundColor: '#F3F4F6',
        borderColor: '#E5E7EB',
    },

    body: {
        paddingHorizontal: 14,
        paddingVertical: 12,
        gap: 4,
    },

    name: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
    },

    scientific: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 6,
    },

    metaRow: {
        display: 'flex',
        flexDirection: 'row',
        gap: 14,
        flexWrap: 'wrap',
    },

    metaItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    metaText: {
        fontSize: 13,
        color: '#334155',
        fontWeight: '500',
    },
    snippet: {
        fontSize: 13,
        color: '#374151',
        fontWeight: '500',
        marginBottom: 6,
    },

    waterPill: {
        backgroundColor: '#EFF6FF',
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },

    sunPill: {
        backgroundColor: '#FFFBEB',
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
});
