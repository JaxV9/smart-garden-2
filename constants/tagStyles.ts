export const TAG_STYLES = {
    'Maladies': { backgroundColor: '#bbf7d0' },
    'Résolu': { backgroundColor: '#bfdbfe' },
    'Récolte': { backgroundColor: '#fde68a' },
    'Plantation': { backgroundColor: '#fed7aa' },
    'Arrosage': { backgroundColor: '#ddd6fe' },
} as const;

export const getTagStyle = (tagName: string) => {
    return TAG_STYLES[tagName as keyof typeof TAG_STYLES] || {};
};
