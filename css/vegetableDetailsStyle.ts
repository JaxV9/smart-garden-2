import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    content: {
        paddingBottom: 0,
    },

    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
    },
    emptyText: {
        color: "#6B7280",
        fontSize: 16,
    },

    coverWrapper: {
        position: "relative",
    },
    cover: {
        width: "100%",
        height: 330,
    },
    coverPlaceholder: {
        backgroundColor: "#E5E7EB",
        alignItems: "center",
        justifyContent: "center",
    },
    placeholderText: {
        color: "#6B7280",
        fontWeight: "600",
    },
    backButton: {
        position: "absolute",
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
        elevation: 4,
    },

    sheet: {
        marginTop: -28,
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 18,
        paddingTop: 18,
        paddingBottom: 24,
    },

    title: {
        fontSize: 26,
        fontWeight: "800",
        color: "#5A7F54",
    },
    subRow: {
        marginTop: 4,
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 6,
    },
    subText: {
        fontSize: 13,
        color: "#6B7280",
        fontWeight: "600",
    },
    dot: {
        color: "#9CA3AF",
        fontWeight: "900",
    },

    h2: {
        marginTop: 18,
        fontSize: 16,
        fontWeight: "800",
        color: "#111827",
    },
    description: {
        marginTop: 8,
        fontSize: 14,
        lineHeight: 21,
        color: "#374151",
    },

    featuresGrid: {
        marginTop: 12,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    feature: {
        width: "47%",
        borderRadius: 12,
        padding: 12,
    },
    featureHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    featureTitle: {
        fontSize: 12,
        color: "#374151",
        fontWeight: "700",
    },
    featureValue: {
        marginTop: 6,
        fontSize: 14,
        color: "#111827",
        fontWeight: "800",
    },
    featureNeutral: {
        backgroundColor: "#F3F4F6",
    },
    featureMint: {
        backgroundColor: "#DFF3EC",
    },
    featureSand: {
        backgroundColor: "#EAD8C2",
    },
    featureRose: {
        backgroundColor: "#E8D0CF",
    },

    calendar: {
        marginTop: 12,
    },
    monthsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 4,
    },
    monthText: {
        width: `${100 / 12}%`,
        textAlign: "center",
        fontSize: 11,
        color: "#111827",
        fontWeight: "700",
    },
    timelineTrack: {
        position: "relative",
        marginTop: 10,
        height: 84,
    },
    timelineBar: {
        position: "absolute",
        top: 0,
        height: 22,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 10,
    },
    timelineBarText: {
        fontSize: 11,
        fontWeight: "800",
        color: "#111827",
    },
    timelineSowing: {
        backgroundColor: "#EAD8C2",
        top: 0,
    },
    timelinePlantation: {
        backgroundColor: "#DFF3EC",
        top: 30,
    },
    timelineHarvest: {
        backgroundColor: "#E8D0CF",
        top: 60,
    },

    tips: {
        marginTop: 10,
        gap: 10,
    },
    tipRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10,
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
        color: "#111827",
        fontWeight: "600",
    },

    plantsGrid: {
        marginTop: 10,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 14,
    },
    plantCard: {
        width: "46%",
    },
    plantImage: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 12,
        backgroundColor: "#F3F4F6",
    },
    plantPlaceholder: {
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    plantPlaceholderText: {
        fontSize: 18,
        fontWeight: "900",
        color: "#6B7280",
    },
    plantName: {
        marginTop: 6,
        fontSize: 13,
        color: "#111827",
        fontWeight: "700",
    },

    ctaBar: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 18,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#EEF2F7",
    },
    ctaButton: {
        width: "100%",
        height: 50,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    green: {
        backgroundColor: "#5A7F54",
        shadowColor: "#5A7F54",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 2,
    },
    red: {
        backgroundColor: "#ea333cff"
    },
    ctaText: {
        color: "#FFFFFF",
        fontWeight: "900",
        letterSpacing: 0.5,
    },
    lockedContainer: {
        marginTop: 24,
        padding: 24,
        borderRadius: 20,
        backgroundColor: "#FCFAF0",
        borderColor: "#FEF3C7",
        borderWidth: 1.5,
        alignItems: "center",
        justifyContent: "center",
    },
    lockedDivider: {
        width: 60,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#FEF3C7",
        marginBottom: 16,
    },
    lockIcon: {
        marginBottom: 12,
    },
    lockedTitle: {
        fontSize: 16,
        fontWeight: "800",
        color: "#B8860B",
        marginBottom: 8,
        textAlign: "center",
    },
    lockedSub: {
        fontSize: 13,
        color: "#6B7280",
        lineHeight: 18,
        textAlign: "center",
        marginBottom: 20,
    },
    unlockBtn: {
        backgroundColor: "#D4AF37",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
        shadowColor: "#D4AF37",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 2,
    },
    unlockBtnText: {
        color: "white",
        fontSize: 13,
        fontWeight: "800",
    },
});