import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, TextInput, useColorScheme, View } from "react-native";
import Button from "../components/Button";
import { UserDeviceListModal, UserDeviceListModalRef } from "../components/Modal";
import Screen from "../components/Screen";
import Text from "../components/Text";
import { useHeader } from "../hooks/useHeader";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAddUserDeviceMutation } from "../services";
import { darkTheme, lightTheme } from "../theme";
import { useToast } from "../utils/toast";

export default function AddUserScreen() {
    const [displayName, setDisplayName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [merchantDeviceID, setMerchantDeviceID] = useState(0);
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? darkTheme : lightTheme;
    const userDeviceListModalRef = useRef<UserDeviceListModalRef>(null);
    const addUserDeviceMutation = useAddUserDeviceMutation();

    const isEnabled = useMemo(() => {
    const isDisplayNameEmpty = displayName.trim() !== '';
    const isUsernameEmpty = username.trim() !== '';
    const isPasswordEmpty = password.trim() !== '';
    const isConfirmPasswordEmpty = confirmPassword.trim() !== '';
    const isMerchantDeviceIDEmpty = Boolean(merchantDeviceID);

    return (
        isDisplayNameEmpty &&
        isUsernameEmpty &&
        isPasswordEmpty &&
        isConfirmPasswordEmpty &&
        isMerchantDeviceIDEmpty
    );
    }, [displayName, username, password, confirmPassword, merchantDeviceID]);

    useHeader({ title: "أضافة مستخدم جهاز", showBackButton: true });
    const { error } = useToast();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const handleAddUserDevice = () => {
        if (!merchantDeviceID) {
            error("يرجى اختيار جهاز التاجر");
            return;
        }
        if (!displayName || !username || !password || !confirmPassword) {
            error("يرجى ملء جميع الحقول");
            return;
        }

        if (password !== confirmPassword) {
            error("كلمة المرور وتأكيد كلمة المرور غير متطابقين");
            return;
        }

        addUserDeviceMutation.mutate(
            {
                deviceMerchantId: merchantDeviceID,
                displayName: displayName,
                userName: username,
                password: password,
                confirmPassword,
            },
            {
                onSuccess: (response) => {
                    // Handle success (e.g., show a success message, navigate back, etc.)
                    alert("تم إضافة مستخدم الجهاز بنجاح");
                    navigation.goBack();
                },
                onError: (err) => {
                    // Handle error (e.g., show an error message)
                    error("حدث خطأ أثناء إضافة مستخدم الجهاز");
                    console.error("Add User Device Error:", err);
                }
            }
    )
    }
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 16,
        },
        list: {
            width: "100%",
            alignSelf: "center",
            gap: 20,
        },
        input: {
            marginBottom: 15,
            borderWidth: 1,
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
            marginBottom: 18,
            },
        inputLabel: {
            textAlign: "right",
            margin: 4,
        },
        buttonTextStyle:
        {
            color: theme.colors.onPrimary
        },
        });

    return (
    <Screen useSafeArea={true} style={styles.container}>
      <ScrollView contentContainerStyle={[{ backgroundColor: theme.colors.background }]}>
        <View style={styles.list}>
            <Button onPress={() => { 
                console.log("Select Device Pressed")
                userDeviceListModalRef.current?.present();
                }}
                gradientColors={[theme.colors.primary, theme.colors.secondary]}
             >
                <Text style={[theme.fonts.bodyMedium, styles.buttonTextStyle]}>اختر الجهاز المستخدم</Text>
                </Button>
            <View>
                <TextInput
                    style={[styles.input, { fontFamily: "AlexandriaRegular" }]}
                    placeholder="اسم العرض على الجهاز"
                    value={displayName}
                    onChangeText={setDisplayName}
                    autoCapitalize="none"
                />
            </View>    
            <View>
                <TextInput
                    style={[styles.input, { fontFamily: "AlexandriaRegular" }]}
                    placeholder="اسم مستخدم الجهاز"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    />
            </View>
            <View>
                <TextInput
                    style={[styles.input, { fontFamily: "AlexandriaRegular" }]}
                    placeholder="كلمة المرور"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                    autoCapitalize="none"
                    />
            </View>
            <View>
                <TextInput
                    style={[styles.input, { fontFamily: "AlexandriaRegular" }]}
                    placeholder="تأكيد كلمة المرور" 
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={true}
                    autoCapitalize="none"
                    />
            </View>
        </View>
    </ScrollView>
    <Button
        gradientColors={isEnabled ? [theme.colors.primary, theme.colors.secondary] : [theme.colors.disabled, theme.colors.disabled]}
        style={styles.button}
        onPress={handleAddUserDevice}
        >
        <Text style={[theme.fonts.bodyMedium, styles.buttonTextStyle]}>أضافة مستخدم جهاز</Text>
      </Button>
    <UserDeviceListModal ref={userDeviceListModalRef} 
    setID={setMerchantDeviceID}/>
    </Screen>
  );
}

