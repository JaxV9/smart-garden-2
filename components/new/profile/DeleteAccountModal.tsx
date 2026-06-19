import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useTranslation } from "@/contexts/language.context";
import { useDeleteAccount, DeletionScope } from "@/hooks/useDeleteAccount";
import { useUserContext } from "@/contexts/user.context";

type Step = "select" | "confirm_data" | "confirm_account";

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
}

const LOCAL_TRANSLATIONS: Record<string, Record<string, string>> = {
  fr: {
    delete_confirm_word: "SUPPRIMER",
    delete_done_title: "Fait !",
    delete_error_title: "Erreur",
    delete_account_title: "Gestion des données",
    delete_account_confirm_account: "Supprimer le compte",
    delete_account_confirm_data: "Confirmer la suppression",
    delete_section_data: "Supprimer des données spécifiques",
    delete_desc_data: "Choisissez les données à effacer. Votre compte sera conservé.",
    delete_deselect_all: "Tout désélectionner",
    delete_select_all: "Tout sélectionner",
    delete_data_garden: "Données du jardin",
    delete_data_garden_desc: "Légumes plantés, historique et espaces.",
    delete_data_tasks: "Tâches",
    delete_data_tasks_desc: "Toutes vos tâches créées.",
    delete_data_sensors: "Capteurs",
    delete_data_sensors_desc: "Capteurs et historiques de mesures.",
    delete_data_community: "Communauté",
    delete_data_community_desc: "Vos publications et commentaires.",
    delete_data_tutorials: "Tutoriels",
    delete_data_tutorials_desc: "Tutoriels créés par vous.",
    delete_full_account: "Supprimer mon compte définitivement",
    delete_full_account_desc: "Toutes vos données seront effacées et votre compte supprimé.",
    delete_section_account: "Zone dangereuse",
    delete_warn_account: "Cette action supprimera définitivement votre compte et toutes vos données. Elle est irréversible.",
    delete_warn_data: "Les données sélectionnées seront supprimées définitivement. Cette action est irréversible.",
    delete_summary: "Ce qui sera supprimé :",
    delete_type_to_confirm: "Tapez {{word}} pour confirmer",
    delete_account_btn: "Supprimer le compte",
    delete_data_btn: "Supprimer les données",
    delete_success_msg: "Données supprimées avec succès.",
    delete_fail_msg: "Une erreur est survenue. Réessayez.",
    btn_cancel: "Annuler",
    btn_continue: "Continuer",
    btn_back: "Retour",
    btn_close: "Fermer",
  },
  en: {
    delete_confirm_word: "DELETE",
    delete_done_title: "Done!",
    delete_error_title: "Error",
    delete_account_title: "Manage Data",
    delete_account_confirm_account: "Delete Account",
    delete_account_confirm_data: "Confirm Deletion",
    delete_section_data: "Delete Specific Data",
    delete_desc_data: "Select the data you want to clear. Your account will remain.",
    delete_deselect_all: "Deselect All",
    delete_select_all: "Select All",
    delete_data_garden: "Garden Data",
    delete_data_garden_desc: "Planted vegetables, history, and spaces.",
    delete_data_tasks: "Tasks",
    delete_data_tasks_desc: "All your created tasks.",
    delete_data_sensors: "Sensors",
    delete_data_sensors_desc: "Sensors and measured histories.",
    delete_data_community: "Community",
    delete_data_community_desc: "Your posts and comments.",
    delete_data_tutorials: "Tutorials",
    delete_data_tutorials_desc: "Tutorials created by you.",
    delete_full_account: "Delete my account permanently",
    delete_full_account_desc: "All your data will be cleared and your account deleted.",
    delete_section_account: "Danger Zone",
    delete_warn_account: "This action will permanently delete your account and all your data. This is irreversible.",
    delete_warn_data: "Selected data will be permanently deleted. This is irreversible.",
    delete_summary: "What will be deleted:",
    delete_type_to_confirm: "Type {{word}} to confirm",
    delete_account_btn: "Delete Account",
    delete_data_btn: "Delete Data",
    delete_success_msg: "Data successfully deleted.",
    delete_fail_msg: "An error occurred. Please try again.",
    btn_cancel: "Cancel",
    btn_continue: "Continue",
    btn_back: "Back",
    btn_close: "Close",
  },
  es: {
    delete_confirm_word: "ELIMINAR",
    delete_done_title: "¡Hecho!",
    delete_error_title: "Error",
    delete_account_title: "Gestionar Datos",
    delete_account_confirm_account: "Eliminar Cuenta",
    delete_account_confirm_data: "Confirmar Eliminación",
    delete_section_data: "Eliminar Datos Específicos",
    delete_desc_data: "Elija los datos que desea borrar. Su cuenta se mantendrá.",
    delete_deselect_all: "Deseleccionar todo",
    delete_select_all: "Seleccionar todo",
    delete_data_garden: "Datos del Jardín",
    delete_data_garden_desc: "Vegetales plantados, historial y espacios.",
    delete_data_tasks: "Tareas",
    delete_data_tasks_desc: "Todas tus tareas creadas.",
    delete_data_sensors: "Sensores",
    delete_data_sensors_desc: "Sensores e historiales de medidas.",
    delete_data_community: "Comunidad",
    delete_data_community_desc: "Tus publicaciones y comentarios.",
    delete_data_tutorials: "Tutoriales",
    delete_data_tutorials_desc: "Tutoriales creados por ti.",
    delete_full_account: "Eliminar mi cuenta permanentemente",
    delete_full_account_desc: "Se borrarán todos sus datos y se eliminará su cuenta.",
    delete_section_account: "Zona Peligrosa",
    delete_warn_account: "Esta acción eliminará permanentemente su cuenta y todos sus datos. Es irreversible.",
    delete_warn_data: "Los datos seleccionados se eliminarán de forma permanente. Es irreversible.",
    delete_summary: "Lo que se eliminará:",
    delete_type_to_confirm: "Escriba {{word}} para confirmar",
    delete_account_btn: "Eliminar Cuenta",
    delete_data_btn: "Eliminar Datos",
    delete_success_msg: "Datos eliminados con éxito.",
    delete_fail_msg: "Ocurrió un error. Intente de nuevo.",
    btn_cancel: "Cancelar",
    btn_continue: "Continuar",
    btn_back: "Volver",
    btn_close: "Cerrar",
  },
  it: {
    delete_confirm_word: "ELIMINA",
    delete_done_title: "Fatto!",
    delete_error_title: "Errore",
    delete_account_title: "Gestione Dati",
    delete_account_confirm_account: "Elimina Account",
    delete_account_confirm_data: "Conferma Eliminazione",
    delete_section_data: "Elimina Dati Specifici",
    delete_desc_data: "Scegli i dati da cancellare. Il tuo account rimarrà attivo.",
    delete_deselect_all: "Deseleziona tutto",
    delete_select_all: "Seleziona tutto",
    delete_data_garden: "Dati del Giardino",
    delete_data_garden_desc: "Piante coltivate, cronologia e spazi.",
    delete_data_tasks: "Compiti",
    delete_data_tasks_desc: "Tutti i tuoi compiti creati.",
    delete_data_sensors: "Sensori",
    delete_data_sensors_desc: "Sensori e cronologia delle misurazioni.",
    delete_data_community: "Comunità",
    delete_data_community_desc: "I tuoi post e commenti.",
    delete_data_tutorials: "Tutorial",
    delete_data_tutorials_desc: "Tutorial creati da te.",
    delete_full_account: "Elimina definitivamente il mio account",
    delete_full_account_desc: "Tutti i tuoi dati verranno cancellati e il tuo account sarà eliminato.",
    delete_section_account: "Zona Pericolosa",
    delete_warn_account: "Questa azione eliminerà definitivamente il tuo account e tutti i tuoi dati. È irreversibile.",
    delete_warn_data: "I dati selezionati verranno eliminati definitivamente. È irreversibile.",
    delete_summary: "Cosa verrà eliminato:",
    delete_type_to_confirm: "Digita {{word}} per confermare",
    delete_account_btn: "Elimina Account",
    delete_data_btn: "Elimina Dati",
    delete_success_msg: "Dati eliminati con successo.",
    delete_fail_msg: "Si è verificato un errore. Riprova.",
    btn_cancel: "Annulla",
    btn_continue: "Continua",
    btn_back: "Indietro",
    btn_close: "Chiudi",
  },
  zh: {
    delete_confirm_word: "删除",
    delete_done_title: "完成！",
    delete_error_title: "错误",
    delete_account_title: "数据管理",
    delete_account_confirm_account: "删除账户",
    delete_account_confirm_data: "确认删除",
    delete_section_data: "删除特定数据",
    delete_desc_data: "选择要清除的数据。您的账户将被保留。",
    delete_deselect_all: "取消全选",
    delete_select_all: "全选",
    delete_data_garden: "花园数据",
    delete_data_garden_desc: "种植的蔬菜、历史记录和空间。",
    delete_data_tasks: "任务",
    delete_data_tasks_desc: "您创建的所有任务。",
    delete_data_sensors: "传感器",
    delete_data_sensors_desc: "传感器和测量历史。",
    delete_data_community: "社区",
    delete_data_community_desc: "您的帖子和评论。",
    delete_data_tutorials: "教程",
    delete_data_tutorials_desc: "您创建的教程。",
    delete_full_account: "永久删除我的账户",
    delete_full_account_desc: "您的所有数据都将被清除，账户将被删除。",
    delete_section_account: "危险区域",
    delete_warn_account: "此操作将永久删除您的账户和所有数据。此操作不可逆。",
    delete_warn_data: "选定的数据将被永久删除。此操作不可逆。",
    delete_summary: "将要删除的内容：",
    delete_type_to_confirm: "输入 {{word}} 以确认",
    delete_account_btn: "删除账户",
    delete_data_btn: "删除数据",
    delete_success_msg: "数据删除成功。",
    delete_fail_msg: "发生错误。请重试。",
    btn_cancel: "取消",
    btn_continue: "继续",
    btn_back: "返回",
    btn_close: "关闭",
  },
  ja: {
    delete_confirm_word: "削除",
    delete_done_title: "完了！",
    delete_error_title: "エラー",
    delete_account_title: "データ管理",
    delete_account_confirm_account: "アカウント削除",
    delete_account_confirm_data: "削除の確認",
    delete_section_data: "特定のデータを削除",
    delete_desc_data: "消去するデータを選択してください。アカウントは保持されます。",
    delete_deselect_all: "すべての選択を解除",
    delete_select_all: "すべて選択",
    delete_data_garden: "庭のデータ",
    delete_data_garden_desc: "植えられた野菜、履歴、およびスペース。",
    delete_data_tasks: "タスク",
    delete_data_tasks_desc: "作成されたすべてのタスク。",
    delete_data_sensors: "センサー",
    delete_data_sensors_desc: "センサーと測定履歴。",
    delete_data_community: "コミュニティ",
    delete_data_community_desc: "あなたの投稿とコメント。",
    delete_data_tutorials: "チュートリアル",
    delete_data_tutorials_desc: "あなたが作成したチュートリアル。",
    delete_full_account: "アカウントを永久に削除",
    delete_full_account_desc: "すべてのデータが消去され、アカウントが削除されます。",
    delete_section_account: "危険ゾーン",
    delete_warn_account: "この操作を行うと、アカウントとすべてのデータが永久に削除されます。この操作は取り消せません。",
    delete_warn_data: "選択したデータは永久に削除されます。この操作は取り消せません。",
    delete_summary: "削除されるもの：",
    delete_type_to_confirm: "確認のために {{word}} と入力してください",
    delete_account_btn: "アカウント削除",
    delete_data_btn: "データを削除",
    delete_success_msg: "データが正常に削除されました。",
    delete_fail_msg: "エラーが発生しました。もう一度お試しください。",
    btn_cancel: "キャンセル",
    btn_continue: "続行",
    btn_back: "戻る",
    btn_close: "閉じる",
  },
  ar: {
    delete_confirm_word: "حذف",
    delete_done_title: "تم!",
    delete_error_title: "خطأ",
    delete_account_title: "إدارة البيانات",
    delete_account_confirm_account: "حذف الحساب",
    delete_account_confirm_data: "تأكيد الحذف",
    delete_section_data: "حذف بيانات محددة",
    delete_desc_data: "اختر البيانات التي تريد مسحها. سيتم الاحتفاظ بحسابك.",
    delete_deselect_all: "إلغاء تحديد الكل",
    delete_select_all: "تحديد الكل",
    delete_data_garden: "بيانات الحديقة",
    delete_data_garden_desc: "الخضروات المزروعة، السجل، والمساحات.",
    delete_data_tasks: "المهام",
    delete_data_tasks_desc: "جميع المهام التي قمت بإنشائها.",
    delete_data_sensors: "المستشعرات",
    delete_data_sensors_desc: "المستشعرات وسجل القياسات.",
    delete_data_community: "المجتمع",
    delete_data_community_desc: "منشوراتك وتعليقاتك.",
    delete_data_tutorials: "الدروس",
    delete_data_tutorials_desc: "الدروس التي قمت بإنشائها.",
    delete_full_account: "حذف حسابي نهائيًا",
    delete_full_account_desc: "سيتم مسح جميع بياناتك وحذف حسابك.",
    delete_section_account: "منطقة خطرة",
    delete_warn_account: "سيؤدي هذا الإجراء إلى حذف حسابك وجميع بياناتك نهائيًا. لا يمكن التراجع عن هذا الإجراء.",
    delete_warn_data: "سيتم حذف البيانات المحددة نهائيًا. لا يمكن التراجع عن هذا الإجراء.",
    delete_summary: "سيتم حذف ما يلي:",
    delete_type_to_confirm: "اكتب {{word}} للتأكيد",
    delete_account_btn: "حذف الحساب",
    delete_data_btn: "حذف البيانات",
    delete_success_msg: "تم حذف البيانات بنجاح.",
    delete_fail_msg: "حدث خطأ. يرجى المحاولة مرة أخرى.",
    btn_cancel: "إلغاء",
    btn_continue: "متابعة",
    btn_back: "رجوع",
    btn_close: "إغلاق",
  },
};

const DATA_ITEMS: { key: keyof Omit<DeletionScope, "account">; icon: string; colorKey: string }[] = [
  { key: "garden",    icon: "leaf-outline",         colorKey: "#5A7F54" },
  { key: "tasks",     icon: "checkmark-done-outline", colorKey: "#2F7D32" },
  { key: "sensors",   icon: "pulse-outline",          colorKey: "#0277BD" },
  { key: "community", icon: "chatbubbles-outline",    colorKey: "#6A1B9A" },
  { key: "tutorials", icon: "book-outline",           colorKey: "#E65100" },
];

export function DeleteAccountModal({ visible, onClose }: DeleteAccountModalProps) {
  const { language } = useTranslation();
  const { user } = useUserContext();
  const { deleteSelectedData, deleteAccount, loading, error } = useDeleteAccount();

  const [step, setStep] = useState<Step>("select");
  const [scope, setScope] = useState<Omit<DeletionScope, "account">>({
    garden: false,
    tasks: false,
    sensors: false,
    community: false,
    tutorials: false,
  });
  const [wantsFullDelete, setWantsFullDelete] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [done, setDone] = useState(false);
  const [resultSuccess, setResultSuccess] = useState<boolean | null>(null);

  // Helper for localized strings fallback
  function tLocal(key: string, defaultText: string): string {
    const currentLangDict = LOCAL_TRANSLATIONS[language] || LOCAL_TRANSLATIONS["fr"];
    return currentLangDict[key] || defaultText;
  }

  const expectedConfirm = tLocal("delete_confirm_word", "SUPPRIMER");
  const confirmValid = confirmText.trim().toUpperCase() === expectedConfirm.toUpperCase();
  const hasSelectedData = Object.values(scope).some(Boolean);

  function handleClose() {
    if (loading) return;
    setStep("select");
    setScope({ garden: false, tasks: false, sensors: false, community: false, tutorials: false });
    setWantsFullDelete(false);
    setConfirmText("");
    setDone(false);
    setResultSuccess(null);
    onClose();
  }

  function toggleScope(key: keyof Omit<DeletionScope, "account">) {
    setScope((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSelectAll() {
    const allOn = Object.values(scope).every(Boolean);
    setScope({ garden: !allOn, tasks: !allOn, sensors: !allOn, community: !allOn, tutorials: !allOn });
  }

  async function handleConfirm() {
    if (!confirmValid) return;

    if (wantsFullDelete) {
      const result = await deleteAccount();
      setResultSuccess(result === "Success");
      setDone(true);
    } else {
      const result = await deleteSelectedData(scope);
      setResultSuccess(result === "Success");
      setDone(true);
    }
  }

  const stepTitle = () => {
    if (done) return resultSuccess ? tLocal("delete_done_title", "Fait !") : tLocal("delete_error_title", "Erreur");
    if (step === "select") return tLocal("delete_account_title", "Gestion des données");
    return wantsFullDelete
      ? tLocal("delete_account_confirm_account", "Supprimer le compte")
      : tLocal("delete_account_confirm_data", "Confirmer la suppression");
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconBadge, { backgroundColor: "#FEE2E2" }]}>
                <Ionicons name="trash-outline" size={20} color="#DC2626" />
              </View>
              <Text style={styles.title}>{stepTitle()}</Text>
            </View>
            <Pressable onPress={handleClose} disabled={loading} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#6B7280" />
            </Pressable>
          </View>

          {/* ── STEP 1: SELECT ── */}
          {step === "select" && !done && (
            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionLabel}>
                {tLocal("delete_section_data", "Supprimer des données spécifiques")}
              </Text>
              <Text style={styles.desc}>
                {tLocal("delete_desc_data", "Choisissez les données à effacer. Votre compte sera conservé.")}
              </Text>

              <Pressable style={styles.selectAllRow} onPress={handleSelectAll}>
                <Text style={styles.selectAllText}>
                  {Object.values(scope).every(Boolean)
                    ? tLocal("delete_deselect_all", "Tout désélectionner")
                    : tLocal("delete_select_all", "Tout sélectionner")}
                </Text>
              </Pressable>

              {DATA_ITEMS.map(({ key, icon, colorKey }) => (
                <Pressable key={key} style={styles.dataRow} onPress={() => toggleScope(key)}>
                  <View style={[styles.dataIcon, { backgroundColor: colorKey + "20" }]}>
                    <Ionicons name={icon as any} size={18} color={colorKey} />
                  </View>
                  <View style={styles.dataTexts}>
                    <Text style={styles.dataLabel}>{tLocal(`delete_data_${key}`, key)}</Text>
                    <Text style={styles.dataDesc}>{tLocal(`delete_data_${key}_desc`, "")}</Text>
                  </View>
                  <Switch
                    value={scope[key]}
                    onValueChange={() => toggleScope(key)}
                    trackColor={{ true: "#DC2626", false: "#E5E7EB" }}
                    thumbColor={scope[key] ? "#FFF" : "#9CA3AF"}
                  />
                </Pressable>
              ))}

              <View style={styles.divider} />

              {/* Danger zone: full account delete */}
              <Text style={[styles.sectionLabel, { color: "#DC2626", marginTop: 4 }]}>
                {tLocal("delete_section_account", "Zone dangereuse")}
              </Text>
              <Pressable
                style={[styles.dataRow, styles.dangerRow, wantsFullDelete && styles.dangerRowActive]}
                onPress={() => setWantsFullDelete((v) => !v)}
              >
                <View style={[styles.dataIcon, { backgroundColor: "#FEE2E2" }]}>
                  <Ionicons name="skull-outline" size={18} color="#DC2626" />
                </View>
                <View style={styles.dataTexts}>
                  <Text style={[styles.dataLabel, { color: "#DC2626" }]}>
                    {tLocal("delete_full_account", "Supprimer mon compte définitivement")}
                  </Text>
                  <Text style={styles.dataDesc}>
                    {tLocal("delete_full_account_desc", "Toutes vos données seront effacées et votre compte supprimé.")}
                  </Text>
                </View>
                <Switch
                  value={wantsFullDelete}
                  onValueChange={(v) => { setWantsFullDelete(v); if (v) setScope({ garden: true, tasks: true, sensors: true, community: true, tutorials: true }); }}
                  trackColor={{ true: "#DC2626", false: "#E5E7EB" }}
                  thumbColor={wantsFullDelete ? "#FFF" : "#9CA3AF"}
                />
              </Pressable>

              <View style={styles.actions}>
                <Pressable style={styles.cancelBtn} onPress={handleClose}>
                  <Text style={styles.cancelText}>{tLocal("btn_cancel", "Annuler")}</Text>
                </Pressable>
                <Pressable
                  style={[styles.nextBtn, !(hasSelectedData || wantsFullDelete) && styles.nextBtnDisabled]}
                  disabled={!(hasSelectedData || wantsFullDelete)}
                  onPress={() => setStep("confirm_data")}
                >
                  <Text style={styles.nextText}>{tLocal("btn_continue", "Continuer")}</Text>
                </Pressable>
              </View>
            </ScrollView>
          )}

          {/* ── STEP 2: CONFIRM ── */}
          {step === "confirm_data" && !done && (
            <View style={styles.body}>
              <View style={styles.warnBox}>
                <Ionicons name="warning-outline" size={24} color="#DC2626" />
                <Text style={styles.warnText}>
                  {wantsFullDelete
                    ? tLocal("delete_warn_account", "Cette action supprimera définitivement votre compte et toutes vos données. Elle est irréversible.")
                    : tLocal("delete_warn_data", "Les données sélectionnées seront supprimées définitivement. Cette action est irréversible.")}
                </Text>
              </View>

              {/* Summary of what will be deleted */}
              <Text style={styles.summaryTitle}>{tLocal("delete_summary", "Ce qui sera supprimé :")}</Text>
              {wantsFullDelete && (
                <View style={styles.summaryItem}>
                  <Ionicons name="person-remove-outline" size={14} color="#DC2626" />
                  <Text style={styles.summaryText}>{tLocal("delete_full_account", "Compte complet")} ({user?.email})</Text>
                </View>
              )}
              {DATA_ITEMS.filter(({ key }) => scope[key]).map(({ key, icon, colorKey }) => (
                <View key={key} style={styles.summaryItem}>
                  <Ionicons name={icon as any} size={14} color={colorKey} />
                  <Text style={styles.summaryText}>{tLocal(`delete_data_${key}`, key)}</Text>
                </View>
              ))}

              <Text style={styles.confirmLabel}>
                {tLocal("delete_type_to_confirm", "Tapez {{word}} pour confirmer").replace("{{word}}", expectedConfirm)}
              </Text>
              <TextInput
                style={[styles.confirmInput, confirmValid && styles.confirmInputValid]}
                value={confirmText}
                onChangeText={setConfirmText}
                autoCapitalize="characters"
                autoCorrect={false}
                placeholder={expectedConfirm}
                placeholderTextColor="#D1D5DB"
              />

              {error && <Text style={styles.errorText}>{error}</Text>}

              <View style={styles.actions}>
                <Pressable style={styles.cancelBtn} onPress={() => setStep("select")}>
                  <Text style={styles.cancelText}>{tLocal("btn_back", "Retour")}</Text>
                </Pressable>
                <Pressable
                  style={[styles.deleteBtn, (!confirmValid || loading) && styles.nextBtnDisabled]}
                  disabled={!confirmValid || loading}
                  onPress={handleConfirm}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" size="small" />
                  ) : (
                    <>
                      <Ionicons name="trash" size={16} color="#FFF" />
                      <Text style={styles.deleteText}>
                        {wantsFullDelete
                          ? tLocal("delete_account_btn", "Supprimer le compte")
                          : tLocal("delete_data_btn", "Supprimer les données")}
                      </Text>
                    </>
                  )}
                </Pressable>
              </View>
            </View>
          )}

          {/* ── DONE ── */}
          {done && (
            <View style={[styles.body, styles.doneContainer]}>
              <View style={[styles.doneIcon, { backgroundColor: resultSuccess ? "#DCFCE7" : "#FEE2E2" }]}>
                <Ionicons
                  name={resultSuccess ? "checkmark-circle" : "close-circle"}
                  size={48}
                  color={resultSuccess ? "#16A34A" : "#DC2626"}
                />
              </View>
              <Text style={styles.doneTitle}>
                {resultSuccess
                  ? tLocal("delete_success_msg", "Données supprimées avec succès.")
                  : tLocal("delete_fail_msg", "Une erreur est survenue. Réessayez.")}
              </Text>
              <Pressable style={styles.doneBtn} onPress={handleClose}>
                <Text style={styles.doneBtnText}>{tLocal("btn_close", "Fermer")}</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
    lineHeight: 18,
  },
  selectAllRow: {
    alignSelf: "flex-end",
    marginBottom: 8,
  },
  selectAllText: {
    fontSize: 13,
    color: "#5A7F54",
    fontWeight: "600",
  },
  dataRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dangerRow: {
    borderColor: "#FCA5A5",
    backgroundColor: "#FFF5F5",
  },
  dangerRowActive: {
    borderColor: "#DC2626",
    backgroundColor: "#FEE2E2",
  },
  dataIcon: {
    width: 36,
    height: 36,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  dataTexts: {
    flex: 1,
  },
  dataLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  dataDesc: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
    marginBottom: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  nextBtn: {
    flex: 1.4,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#DC2626",
    alignItems: "center",
  },
  nextBtnDisabled: {
    backgroundColor: "#E5E7EB",
  },
  nextText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFF",
  },
  deleteBtn: {
    flex: 1.4,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#DC2626",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFF",
  },
  warnBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    alignItems: "flex-start",
  },
  warnText: {
    flex: 1,
    fontSize: 13,
    color: "#991B1B",
    lineHeight: 18,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 13,
    color: "#374151",
  },
  confirmLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 20,
    marginBottom: 8,
  },
  confirmInput: {
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 1,
    backgroundColor: "#F9FAFB",
  },
  confirmInputValid: {
    borderColor: "#16A34A",
    backgroundColor: "#F0FDF4",
  },
  errorText: {
    fontSize: 12,
    color: "#DC2626",
    marginTop: 6,
  },
  doneContainer: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 16,
  },
  doneIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  doneTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  doneBtn: {
    backgroundColor: "#5A7F54",
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 32,
  },
  doneBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFF",
  },
});
