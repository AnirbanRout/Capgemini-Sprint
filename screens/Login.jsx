import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { login } from "../redux/slice/AuthSlice";

import { Platform } from "react-native";

import Api from "../api/Api";

const LoginSchema = Yup.object({
  email: Yup.string().email("Invalid Email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const ErrorText = ({ children }) => (
  <Text style={{ color: "red", marginBottom: 10 }}>{children}</Text>
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

      await AsyncStorage.setItem(
        "auth",
        JSON.stringify({
          token,
          user,
        }),
      );

      resetForm();

      navigation.replace("Drawer");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={LoginSchema}
      onSubmit={handleLogin}
    >
      {({
        values,
        handleChange,
        handleBlur,
        handleSubmit,
        touched,
        errors,
      }) => (
        <View style={styles.container}>
          <Text style={styles.heading}>Login</Text>

          <TextInput
            placeholder="Email"
            style={styles.input}
            value={values.email}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
          />
          <ErrorMessage name="email" component={ErrorText} />

          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={values.password}
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
          />
          <ErrorMessage name="password" component={ErrorText} />

          <Button title="Login" onPress={handleSubmit} />
        </View>
      )}
    </Formik>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});
