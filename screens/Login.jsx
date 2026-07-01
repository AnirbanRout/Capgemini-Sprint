import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { login } from "../redux/slice/AuthSlice";
import Api from "../api/Api";

const LoginSchema = Yup.object({
  email: Yup.string().email("Invalid Email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const ErrorText = ({ children }) => (
  <Text style={styles.errorText}>{children}</Text>
);

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const handleLogin = async (values, { resetForm }) => {
    try {
      const res = await Api.get(`/users?email=${values.email}`);

      if (res.data.length === 0) {
        Alert.alert("Error", "User not found");
        return;
      }

      const user = res.data[0];

      if (user.password !== values.password) {
        Alert.alert("Error", "Invalid password");
        return;
      }

      const token = `token_${Date.now()}`;

      dispatch(login({ user, token }));

      await AsyncStorage.setItem("auth", JSON.stringify({ user, token }));

      resetForm();
      navigation.replace("Drawer");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Welcome Back 👋</Text>
        <Text style={styles.subHeading}>Login to continue</Text>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ values, handleChange, handleBlur, handleSubmit }) => (
            <View>
              {/* EMAIL */}
              <TextInput
                placeholder="Email"
                style={styles.input}
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9ca3af"
              />
              <ErrorMessage name="email" component={ErrorText} />

              {/* PASSWORD */}
              <TextInput
                placeholder="Password"
                style={styles.input}
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                secureTextEntry
                placeholderTextColor="#9ca3af"
              />
              <ErrorMessage name="password" component={ErrorText} />

              {/* BUTTON */}
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f9fafb",
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111827",
  },

  subHeading: {
    textAlign: "center",
    marginBottom: 30,
    color: "#6b7280",
  },

  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  button: {
    backgroundColor: "#111827",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },

  errorText: {
    color: "red",
    marginBottom: 8,
    fontSize: 12,
  },
});

export default LoginScreen;
