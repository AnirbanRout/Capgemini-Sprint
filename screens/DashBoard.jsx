import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { View, Text, FlatList, ScrollView, StyleSheet } from "react-native";
import Api from "../api/Api";

import { TouchableOpacity } from "react-native-gesture-handler";

const DashBoard = ({ navigation }) => {
  const userData = useSelector((state) => state.auth);
  const darkMode = useSelector((state) => state.theme.darkMode);

  const [workoutHistoryData, setWorkoutHistoryData] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [workoutData, setWorkoutData] = useState([]);
  const [preferences, setPreferences] = useState([]);

  const styles = createStyles(darkMode);

  useEffect(() => {
    if (!userData.user.id) return;

    Api.get("/workouts").then((res) => setWorkoutData(res.data));
    Api.get("/nutrition").then((res) => setNutrition(res.data));
    Api.get(`/workoutHistory?userId=${userData.user.id}`).then((res) =>
      setWorkoutHistoryData(res.data),
    );
    Api.get(`/preferences?userId=${userData.user.id}`).then((res) =>
      setPreferences(res.data),
    );
  }, []);

  const workoutMap = React.useMemo(() => {
    const map = {};
    workoutData.forEach((w) => (map[w.id] = w));
    return map;
  }, [workoutData]);

  const totalWorkouts = workoutHistoryData.length;

  const totalCaloriesBurned = workoutHistoryData.reduce(
    (sum, item) => sum + (workoutMap[item.workoutId]?.calories || 0),
    0,
  );

  const totalMinutes = workoutHistoryData.reduce(
    (sum, item) => sum + item.durationCompleted,
    0,
  );

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerCard}>
        <Text style={styles.welcome}>Welcome {userData.user.name} 👋</Text>
        <Text style={styles.subText}>Let’s crush today’s goals</Text>
      </View>

      {/* STATS ROW */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalWorkouts}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalCaloriesBurned}</Text>
          <Text style={styles.statLabel}>Calories</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalMinutes}</Text>
          <Text style={styles.statLabel}>Minutes</Text>
        </View>
      </View>

      {/* WORKOUT HISTORY */}
      <Text style={styles.sectionTitle}>Workout History</Text>

      {workoutHistoryData.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.cardTitle}>
            {workoutMap[item.workoutId]?.name}
          </Text>

          <View style={styles.row}>
            <Text>{item.date}</Text>
            <Text>{item.durationCompleted} min</Text>
          </View>

          <Text style={styles.calText}>
            {workoutMap[item.workoutId]?.calories} kcal burned
          </Text>
        </View>
      ))}

      {/* NUTRITION */}
      <Text style={styles.sectionTitle}>Nutrition</Text>

      <View style={styles.grid}>
        {nutrition.slice(0, 4).map((item) => (
          <View key={item.id} style={styles.smallCard}>
            <Text style={styles.cardTitle}>{item.meal}</Text>
            <Text>{item.calories} kcal</Text>
          </View>
        ))}
      </View>

      {/* PREFERENCES */}
      <Text style={styles.sectionTitle}>Your Goal</Text>

      {preferences.map((item) => (
        <View key={item.id} style={styles.goalCard}>
          <Text style={styles.goalText}>🎯 {item.goal}</Text>
          <Text>Theme: {item.theme}</Text>
        </View>
      ))}

      <TouchableOpacity
        style={styles.navCard}
        onPress={() => navigation.navigate("Workouts")}
      >
        <Text style={styles.navText}>🏋️ Go to Workouts</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navCard}
        onPress={() => navigation.navigate("Profile")}
      >
        <Text style={styles.navText}>🏋️ Go to Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navCard}
        onPress={() => navigation.navigate("Nutrition")}
      >
        <Text style={styles.navText}>🏋️ Go to Nutrition</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DashBoard;

const createStyles = (darkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkMode ? "#0f172a" : "#f4f6f8",
      padding: 15,
    },

    headerCard: {
      backgroundColor: darkMode ? "#1d4ed8" : "#4f46e5",
      padding: 20,
      borderRadius: 15,
    },

    welcome: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#fff",
    },

    subText: {
      color: "#e5e7eb",
      marginTop: 5,
    },

    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 15,
    },

    statCard: {
      flex: 1,
      backgroundColor: darkMode ? "#1e293b" : "#fff",
      marginHorizontal: 5,
      padding: 15,
      borderRadius: 12,
      alignItems: "center",
      elevation: 3,
    },

    statNumber: {
      fontSize: 18,
      fontWeight: "bold",
      color: darkMode ? "#f8fafc" : "#111827",
    },

    statLabel: {
      fontSize: 12,
      color: darkMode ? "#cbd5e1" : "#666",
    },

    sectionTitle: {
      marginTop: 20,
      marginBottom: 10,
      fontSize: 16,
      fontWeight: "bold",
      color: darkMode ? "#f8fafc" : "#111827",
    },

    card: {
      backgroundColor: darkMode ? "#1e293b" : "#fff",
      padding: 15,
      borderRadius: 12,
      marginBottom: 10,
      elevation: 2,
    },

    cardTitle: {
      fontWeight: "bold",
      marginBottom: 5,
      color: darkMode ? "#f8fafc" : "#111827",
    },

    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      color: darkMode ? "#cbd5e1" : "#111827",
    },

    calText: {
      marginTop: 5,
      color: darkMode ? "#4ade80" : "#16a34a",
    },

    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },

    smallCard: {
      width: "48%",
      backgroundColor: darkMode ? "#1e293b" : "#fff",
      padding: 12,
      borderRadius: 12,
      marginBottom: 10,
      elevation: 2,
    },

    goalCard: {
      backgroundColor: darkMode ? "#1e293b" : "#fff",
      padding: 15,
      borderRadius: 12,
    },

    goalText: {
      fontWeight: "bold",
      fontSize: 16,
      color: darkMode ? "#f8fafc" : "#111827",
    },

    navCard: {
      backgroundColor: darkMode ? "#334155" : "#111827",
      padding: 15,
      borderRadius: 12,
      marginTop: 10,
    },

    navText: {
      color: "#fff",
      fontWeight: "bold",
      textAlign: "center",
    },
  });
