import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TextInput, useColorScheme, View } from "react-native";
import { Button } from "react-native-paper";
import Screen from "../components/Screen";
import Text from "../components/Text";
import { useHeader } from "../hooks/useHeader";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useEditUserDeviceMutation } from "../services";
import { darkTheme, lightTheme } from "../theme";
import { useToast } from "../utils/toast";

export default function EditUserScreen() {
    const route = useRoute<RouteProp<RootStackParamList, "EditUser">>();
    console.log("EditUserScreen Route Params:", route.params);
    const { userId, oldUsername, oldDisplayName } = route.params;   
    const [displayName, setDisplayName] = useState(oldDisplayName || "");
    const [username, setUsername] = useState(oldUsername || "");
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const editUserDeviceMutation = useEditUserDeviceMutation();

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
                id: userId,
                displayName: displayName,
                userName: username,
            },
            {
                onSuccess: (response) => {
                    // Handle success (e.g., show a success message, navigate back, etc.)
                    alert("تم تعديل مستخدم الجهاز بنجاح");
                    navigation.goBack();
                },
                onError: (err, _, res) => {
                    // Handle error (e.g., show an error message)
                    error("حدث خطأ أثناء تعديل مستخدم الجهاز");
                    console.error("Edit User Device Error:", err,);
                },
            })
        }

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
    </ScrollView>
        <Button
        style={styles.button}
        mode="contained"
        buttonColor={theme.colors.primary}
        labelStyle={{ fontFamily: "AlexandriaRegular" }} 
        onPress={() => { 
            console.log("Save Pressed")
            handleEditUserDevice();
         }}
        >
        <Text>أضافة مستخدم جهاز</Text>
      </Button>
    </Screen>
  );
}