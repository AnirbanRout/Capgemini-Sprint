import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

const Settings = ({ navigation }) => {
  const user = useSelector((state) => state.auth.user);

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Profile</Text>

        <Text style={styles.text}>Name: {user?.name}</Text>
        <Text style={styles.text}>Email: {user?.email}</Text>
        <Text style={styles.text}>Age: {user?.age}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.title}>Notifications</Text>

          <Switch value={notifications} onValueChange={setNotifications} />
        </View>

        <View style={styles.row}>
          <Text style={styles.title}>Dark Mode</Text>

          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Units</Text>

        <Text style={styles.text}>Weight: kg</Text>
        <Text style={styles.text}>Height: cm</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>App Version</Text>

        <Text style={styles.text}>HealthTrack v1.0.0</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 20,
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },

  text: {
    fontSize: 15,
    color: "#4b5563",
    marginTop: 8,
  },

  button: {
    backgroundColor: "#111827",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Settings;
