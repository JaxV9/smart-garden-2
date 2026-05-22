export const getTimeAgo = (date: string): string => {
    const now = new Date();
    const createdAt = new Date(date);
    const diffInMs = now.getTime() - createdAt.getTime();
    
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);
    
    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInDays < 30) return `Il y a ${diffInDays}j`;
    if (diffInMonths < 12) return `Il y a ${diffInMonths} mois`;
    return `Il y a ${diffInYears} an${diffInYears > 1 ? 's' : ''}`;
};
