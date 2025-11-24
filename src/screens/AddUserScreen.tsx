import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";
import { Button } from "react-native-paper";
import { UserDeviceListModal, UserDeviceListModalRef } from "../components/Modal";
import Screen from "../components/Screen";
import Text from "../components/Text";
import { useHeader } from "../hooks/useHeader";
import { darkTheme, lightTheme } from "../theme";

export default function AddUserScreen() {
    const [displayName, setDisplayName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [merchantDeviceID, setMerchantDeviceID] = useState(0);
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? darkTheme : lightTheme;
    useHeader({ title: "أضافة مستخدم جهاز", showBackButton: true });
    const userDeviceListModalRef = useRef<UserDeviceListModalRef>(null);
    const styles = StyleSheet.create({
        container: {
            padding: 16,
        },
        list: {
            width: "100%",
            maxWidth: 960,
            alignSelf: "center",
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
            marginBottom: 15,
            },
        });

    return (
    <Screen>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.list}>
            <TouchableOpacity onPress={() => { 
                console.log("Select Device Pressed")
                userDeviceListModalRef.current?.present();
             }}>
                <Text>اختر الجهاز المستخدم</Text>
                </TouchableOpacity>
            <TextInput
                style={[styles.input, { fontFamily: "AlexandriaRegular" }]}
                placeholder="اسم مستخدم الجهاز"
                value={displayName}
                onChangeText={setDisplayName}
                autoCapitalize="none"
            />
            <TextInput
                style={[styles.input, { fontFamily: "AlexandriaRegular" }]}
                placeholder="اسم المستخدم"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                />
            <TextInput
                style={[styles.input, { fontFamily: "AlexandriaRegular" }]}
                placeholder="كلمة المرور"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                autoCapitalize="none"
                />
            <TextInput
                style={[styles.input, { fontFamily: "AlexandriaRegular" }]}
                placeholder="تأكيد كلمة المرور" 
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={true}
                autoCapitalize="none"
                />
        </View>
    </ScrollView>
    <Button
        style={styles.button}
        mode="contained"
        buttonColor={theme.colors.primary}
        labelStyle={{ fontFamily: "AlexandriaRegular" }} 
        >
        <Text>أضافة مستخدم جهاز</Text>
      </Button>
    <UserDeviceListModal ref={userDeviceListModalRef} 
    setID={setMerchantDeviceID}/>
    </Screen>
  );
}

