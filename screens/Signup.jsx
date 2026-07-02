import React from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

import Api from "../api/Api";

const signupSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
  age: Yup.number().required("Age is required"),
  height: Yup.number().required("Height is required"),
  weight: Yup.number().required("Weight is required"),
});

const ErrorText = ({ children }) => (
  <Text style={styles.error}>{children}</Text>
);

const Signup = ({ navigation }) => {
  const handleSignup = (values, { resetForm }) => {
    const userData = {
      name: values.name,
      email: values.email,
      password: values.password,
      age: Number(values.age),
      weight: Number(values.weight),
      height: Number(values.height),

      profilePhoto: "",
      role: "user",
      progressPhotos: [],
    };

    Api.post("/users", userData)
      .then((response) => {
        Alert.alert("Success", "Account created successfully");
        resetForm();
        navigation.navigate("Login");
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Error", "Something went wrong");
      });
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
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            age: "",
            height: "",
            weight: "",
          }}
          validationSchema={signupSchema}
          onSubmit={handleSignup}
        >
          {({ values, handleChange, handleBlur, handleSubmit }) => (
            <View>
              <Text style={styles.title}>Create Account</Text>

              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#9ca3af"
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
              />
              <ErrorMessage name="name" component={ErrorText} />

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
              />
              <ErrorMessage name="email" component={ErrorText} />

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
              />
              <ErrorMessage name="password" component={ErrorText} />

              <TextInput
                style={styles.input}
                placeholder="Age"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={values.age}
                onChangeText={handleChange("age")}
                onBlur={handleBlur("age")}
              />
              <ErrorMessage name="age" component={ErrorText} />

              <TextInput
                style={styles.input}
                placeholder="Height (cm)"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={values.height}
                onChangeText={handleChange("height")}
                onBlur={handleBlur("height")}
              />
              <ErrorMessage name="height" component={ErrorText} />

              <TextInput
                style={styles.input}
                placeholder="Weight (kg)"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={values.weight}
                onChangeText={handleChange("weight")}
                onBlur={handleBlur("weight")}
              />
              <ErrorMessage name="weight" component={ErrorText} />

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.buttonText}>
                  Already have an account? Login
                </Text>
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
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#222",
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

  error: {
    color: "#ef4444",
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 2,
  },
});

export default Signup;
