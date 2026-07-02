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
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ values, handleChange, handleBlur, handleSubmit }) => (
            <View>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#9ca3af"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <ErrorMessage name="email" component={ErrorText} />

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                secureTextEntry
              />
              <ErrorMessage name="password" component={ErrorText} />

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.buttonText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#222",
    marginBottom: 8,
  },

  subHeading: {
    fontSize: 16,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 30,
  },

  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    backgroundColor: "#fafafa",
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 8,
  },

  errorText: {
    color: "#ef4444",
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 2,
  },

  button: {
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 15,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default LoginScreen;
