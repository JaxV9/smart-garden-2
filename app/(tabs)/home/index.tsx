            <View style={styles.gap16}>
                <Text style={styles.title}>Mon jardin</Text>
                <View style={styles.headerBtnContainer}>
                    <Pressable onPress={() => setCurrentSection('resume')}
                        style={currentSection === 'resume' ? styles.headerBtnSelected : styles.headerBtn}>
                        <Text style={styles.headerTxtBtn}>Résumé</Text>
                    </Pressable>
                    <Pressable onPress={() => setCurrentSection('plants')}
                        style={currentSection === 'plants' ? styles.headerBtnSelected : styles.headerBtn}>
                        <Text style={styles.headerTxtBtn}>Mes plantes</Text>
                    </Pressable>
                </View>
            </View>
            {
                currentSection === 'resume' &&
                <ResumeSection />
            }
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
        backgroundColor: '#F9FAFB'
    },
    gap16: {
        gap: 16
    },
    gap8: {
        gap: 8
    },
    title: {
        fontSize: 22
    },
    headerBtnContainer: {
        flexDirection: 'row',
        gap: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F1F1'
    },
    headerBtnSelected: {
        backgroundColor: '#61b4586f',
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#5B8E55'
    },
    headerBtn: {
        backgroundColor: '#F1F1F1',
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB'
    },
    headerTxtBtn: {
        fontSize: 18
    }
});
