import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSelector } from "react-redux";

const About = ({ navigation }) => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const styles = createStyles(darkMode);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>About HealthTrack</Text>

      <View style={styles.card}>
        <Text style={styles.title}>App Description</Text>

        <Text style={styles.text}>
          HealthTrack is a fitness application that helps users manage workouts,
          nutrition, outdoor runs, and personal fitness progress.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Features</Text>

        <Text style={styles.text}>• Workout Tracking</Text>
        <Text style={styles.text}>• Nutrition Management</Text>
        <Text style={styles.text}>• Workout History</Text>
        <Text style={styles.text}>• Outdoor Run Tracking</Text>
        <Text style={styles.text}>• Progress Photos</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Developer</Text>

        <Text style={styles.text}>Developed by: Your Name</Text>
        <Text style={styles.text}>Version: 1.0.0</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Contact</Text>

        <Text style={styles.text}>Email: support@healthtrack.com</Text>
      </View>
    </ScrollView>
  );
};

const createStyles = (darkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkMode ? "#0f172a" : "#f3f4f6",
      padding: 20,
    },

    heading: {
      fontSize: 28,
      fontWeight: "bold",
      color: darkMode ? "#f8fafc" : "#111827",
      marginBottom: 20,
    },

    card: {
      backgroundColor: darkMode ? "#1e293b" : "#fff",
      borderRadius: 12,
      padding: 18,
      marginBottom: 15,
      elevation: 2,
    },

    title: {
      fontSize: 17,
      fontWeight: "bold",
      color: darkMode ? "#f8fafc" : "#111827",
      marginBottom: 10,
    },

    text: {
      fontSize: 15,
      color: darkMode ? "#cbd5e1" : "#4b5563",
      lineHeight: 24,
    },
  });

export default About;
