import React from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const signupSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
  age: Yup.number().required("Age is required"),
  height: Yup.number().required("Height is required"),
  weight: Yup.number().required("Weight is required"),
});

const ErrorText = ({ children }) => (
  <Text style={{ color: "red", marginBottom: 10 }}>{children}</Text>
);

const Signup = () => {
  const handleSignup = (values) => {
    const userData = {
      username: values.username,
      email: values.email,
      password: values.password,
      age: values.age,
      height: values.height,
      weight: values.weight,
    };

    axios
      .post("http://10.0.2.2:3000/users", userData)
      .then((response) => {
        console.log("User registered successfully:", response.data);
        Alert.alert("Success", "User registered successfully");
      })
      .catch((error) => {
        console.error("Error registering user:", error);
        Alert.alert("Error", "Failed to register user");
      });
  };

  return (
    <Formik
      initialValues={{
        username: "",
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
        <View style={{ padding: 20 }}>
          <TextInput
            placeholder="Username"
            value={values.username}
            onChangeText={handleChange("username")}
            onBlur={handleBlur("username")}
          />
          <ErrorMessage name="username" component={ErrorText} />

          <TextInput
            placeholder="Email"
            value={values.email}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
          />
          <ErrorMessage name="email" component={ErrorText} />

          <TextInput
            placeholder="Password"
            secureTextEntry
            value={values.password}
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
          />
          <ErrorMessage name="password" component={ErrorText} />

          <TextInput
            placeholder="Age"
            keyboardType="numeric"
            value={values.age}
            onChangeText={handleChange("age")}
            onBlur={handleBlur("age")}
          />
          <ErrorMessage name="age" component={ErrorText} />

          <TextInput
            placeholder="Height"
            keyboardType="numeric"
            value={values.height}
            onChangeText={handleChange("height")}
            onBlur={handleBlur("height")}
          />
          <ErrorMessage name="height" component={ErrorText} />

          <TextInput
            placeholder="Weight"
            keyboardType="numeric"
            value={values.weight}
            onChangeText={handleChange("weight")}
            onBlur={handleBlur("weight")}
          />
          <ErrorMessage name="weight" component={ErrorText} />

          <Button title="Signup" onPress={handleSubmit} />
        </View>
      )}
    </Formik>
  );
};

export default Signup;
