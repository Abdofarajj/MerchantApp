import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TextInput, useColorScheme, View } from "react-native";
import Button from "../components/Button";
import Screen from "../components/Screen";
import Text from "../components/Text";
import { useHeader } from "../hooks/useHeader";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useEditUserDeviceMutation, useResetPasswordMutation } from "../services";
import { darkTheme, lightTheme } from "../theme";
import { useToast } from "../utils/toast";

export default function EditUserScreen() {
    const route = useRoute<RouteProp<RootStackParamList, "EditUser">>();
    console.log("EditUserScreen Route Params:", route.params);
    const { user } = route.params;   
    const {displayName: oldDisplayName, userName: oldUsername,} = user
    const [displayName, setDisplayName] = useState(oldDisplayName || "");
    const [username, setUsername] = useState(oldUsername || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const editUserDeviceMutation = useEditUserDeviceMutation();
    const resetPasswordMutation = useResetPasswordMutation();

    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? darkTheme : lightTheme;
    useHeader({ title: "تعديل مستخدم جهاز", showBackButton: true });

    const { error } = useToast();

    const handleEditUserDevice = () => {
        console.log(`Old Display Name: ${oldDisplayName}, New Display Name: ${displayName}.
            \n Old Username: ${oldUsername}, New Username: ${username}.`);

        if (!displayName || !username) {
            error("يرجى ملء جميع الحقول");
            return;
        }
        if (displayName === oldDisplayName && username === oldUsername) {
            error("لم يتم إجراء أي تغييرات");
            return;
        }
    
        editUserDeviceMutation.mutate(
            {
                id: user.id,
                displayName: displayName,
                userName: username,
            },
            {
                onSuccess: (response) => {
                    // Handle success (e.g., show a success message, navigate back, etc.)
                    alert("تم تعديل مستخدم الجهاز بنجاح");
                    navigation.navigate("Tabs", undefined, {pop: true})
                },
                onError: (err, _, res) => {
                    // Handle error (e.g., show an error message)
                    error("حدث خطأ أثناء تعديل مستخدم الجهاز");
                    console.error("Edit User Device Error:", err,);
                },
            })
        }

    const handleEditUserDevicePassowrd = () => {
        if (!password && !confirmPassword)
            return

        if (password !== confirmPassword) {
            error("كلمة المرور وتأكيد كلمة المرور غير متطابقين");
            return
        }
        resetPasswordMutation.mutate(
            {
                userId: user.id,
                userName: username ?? oldUsername,
                password: password,
                confirmPassword: confirmPassword,
            },
            {
                onSuccess: (res) => {
                    alert("تم تعديل كلمة السر بنجاح");
                    navigation.navigate("Tabs", undefined, {pop: true})
                },
                onError: (err, _, res) => {
                    // Handle error (e.g., show an error message)
                    error("حدث خطأ أثناء تعديل كلمة السر");
                    console.error("Edit User Device Error:", err,);
                },
            }                
        )
    }

    const styles = StyleSheet.create({
        container: {
            padding: 16,
        },
        list: {
            width: "100%",
            alignSelf: "center",
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.onBackground,
            marginBottom: theme.spacing[10]
        },
        input: {
            marginBottom: 15,
            borderWidth: 2,
            borderColor: theme.colors.outline,
            borderRadius: 12,
            padding: 10,
            // backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            textAlign: "right",
            },
            passwordInput: {
            marginBottom: 15,
            borderWidth: 1,
            borderColor: theme.colors.outline,
            borderRadius: 12,
            padding: 10,
            paddingLeft: 40,
            // backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            textAlign: "right",
            },
        button: {
            marginBottom: 15,
            marginHorizontal: 8,
            },
        inputLabel: {
            textAlign: "right",
            margin: 4,
        },
        section: {
            marginVertical: 8,
        }
        });

    return (
    <Screen>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.list}>
            <Text style={[theme.fonts.labelLarge, styles.inputLabel]} >تعديل بيانات مستخدم الجهاز</Text>
            <View style={styles.section}>
                <Text style={[theme.fonts.labelSmall, styles.inputLabel]} >اسم العرض على الجهاز</Text>
                <TextInput
                    style={[styles.input, { fontFamily: "AlexandriaRegular" }]}
                    placeholder="اسم العرض على الجهاز"
                    value={displayName}
                    onChangeText={setDisplayName}
                    onEndEditing={() =>{
                        if (displayName.trim() === "") {
                            setDisplayName(oldDisplayName || "");
                        }
                    }}
                    autoCapitalize="none"
                />
                </View>
                <View style={styles.section}>
                    <Text style={[theme.fonts.labelSmall, styles.inputLabel]} >اسم مستخدم الجهاز</Text>
                    <TextInput
                        style={[styles.input, { fontFamily: "AlexandriaRegular" }]}
                        placeholder="اسم مستخدم الجهاز"
                        value={username}
                        onChangeText={setUsername}
                        onEndEditing={() =>{
                            if (username.trim() === "") {
                                setUsername(oldUsername || "");
                            }
                        }}
                        autoCapitalize="none"
                        />
            </View>
            <Button
                gradientColors={[theme.colors.primary, theme.colors.secondary]}
                style={styles.button}
                onPress={() => { 
                    console.log("Save Pressed")
                    handleEditUserDevice();
                }}>
<Text style={[theme.fonts.bodyMedium, {color: theme.colors.onPrimary}]}>تعديل المستخدم</Text>
            </Button>
        </View>
        <View style={styles.list}>
            <Text style={[theme.fonts.labelLarge, styles.inputLabel]} >تعديل كلمة مرور مستخدم الجهاز</Text>
            <View style={styles.section}>
                <Text style={[theme.fonts.labelSmall, styles.inputLabel]} >كلمة المرور الجديدة</Text>
                <TextInput
                    style={[styles.input, { fontFamily: "AlexandriaRegular" }]}
                    placeholder="كلمة المرور"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                    autoCapitalize="none"
                    />
            </View>
            <View style={styles.section}>
                <Text style={[theme.fonts.labelSmall, styles.inputLabel]} >تأكيد كلمة المرور الجديدة</Text>
                <TextInput
                    style={[styles.input, { fontFamily: "AlexandriaRegular" }]}
                    placeholder="تأكيد كلمة المرور" 
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={true}
                    autoCapitalize="none"
                    />
            </View>        

            <Button
                gradientColors={[theme.colors.primary, theme.colors.secondary]}
                style={styles.button} 
                onPress={() => { 
                    console.log("Save Pressed")
                    handleEditUserDevicePassowrd();
                }}>
                <Text style={[theme.fonts.bodyMedium, {color: theme.colors.onPrimary}]}>تعديل كلمة المرور</Text>
            </Button>
        </View>
    </ScrollView>
    </Screen>
  );
}