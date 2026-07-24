import { LanguageType } from "@/constants/translations";

const timeAgoDict: Record<LanguageType, {
    justNow: string;
    min: (x: number) => string;
    hour: (x: number) => string;
    day: (x: number) => string;
    month: (x: number) => string;
    year: (x: number) => string;
}> = {
    fr: {
        justNow: "À l'instant",
        min: (x) => `Il y a ${x} min`,
        hour: (x) => `Il y a ${x}h`,
        day: (x) => `Il y a ${x}j`,
        month: (x) => `Il y a ${x} mois`,
        year: (x) => `Il y a ${x} an${x > 1 ? 's' : ''}`
    },
    en: {
        justNow: "Just now",
        min: (x) => `${x}m ago`,
        hour: (x) => `${x}h ago`,
        day: (x) => `${x}d ago`,
        month: (x) => `${x}mo ago`,
        year: (x) => `${x}y ago`
    },
    es: {
        justNow: "Ahora mismo",
        min: (x) => `Hace ${x} min`,
        hour: (x) => `Hace ${x}h`,
        day: (x) => `Hace ${x}d`,
        month: (x) => `Hace ${x} meses`,
        year: (x) => `Hace ${x} año${x > 1 ? 's' : ''}`
    },
    it: {
        justNow: "Proprio ora",
        min: (x) => `${x} min fa`,
        hour: (x) => `${x} ore fa`,
        day: (x) => `${x} giorni fa`,
        month: (x) => `${x} mesi fa`,
        year: (x) => `${x} anno${x > 1 ? 'i' : ''} fa`
    },
    zh: {
        justNow: "刚刚",
        min: (x) => `${x}分钟前`,
        hour: (x) => `${x}小时前`,
        day: (x) => `${x}天前`,
        month: (x) => `${x}个月前`,
        year: (x) => `${x}年前`
    },
    ja: {
        justNow: "たった今",
        min: (x) => `${x}分前`,
        hour: (x) => `${x}時間前`,
        day: (x) => `${x}日前`,
        month: (x) => `${x}ヶ月前`,
        year: (x) => `${x}年前`
    },
    ar: {
        justNow: "الآن",
        min: (x) => `منذ ${x} دقيقة`,
        hour: (x) => `منذ ${x} ساعة`,
        day: (x) => `منذ ${x} يوم`,
        month: (x) => `منذ ${x} شهر`,
        year: (x) => `منذ ${x} سنة`
    }
};

export const getTimeAgo = (date: string, lang: string = 'fr'): string => {
    const now = new Date();
    const createdAt = new Date(date);
    const diffInMs = now.getTime() - createdAt.getTime();
    
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);
    
    const currentLang = (timeAgoDict[lang as LanguageType] ? lang : 'fr') as LanguageType;
    const dict = timeAgoDict[currentLang];

    if (diffInMinutes < 1) return dict.justNow;
    if (diffInMinutes < 60) return dict.min(diffInMinutes);
    if (diffInHours < 24) return dict.hour(diffInHours);
    if (diffInDays < 30) return dict.day(diffInDays);
    if (diffInMonths < 12) return dict.month(diffInMonths);
    return dict.year(diffInYears);
};
