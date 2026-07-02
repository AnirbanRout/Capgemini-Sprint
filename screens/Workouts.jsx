import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Api from "../api/Api";
import { addWorkoutHistory } from "../redux/slice/WorkoutSlice";

const WorkoutScreen = ({ navigation }) => {
  const userData = useSelector((state) => state.auth);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingWorkoutId, setLoadingWorkoutId] = useState(null);

  const [addedMap, setAddedMap] = useState({}); // 👈 button state

  const userId = userData?.user?.id;
  const styles = createStyles(darkMode);

  const getWorkouts = async () => {
    try {
      setLoading(true);
      const res = await Api.get("/workouts");
      setWorkouts(res.data);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to load workouts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWorkouts();
  }, []);

  const startWorkout = async (workout) => {
    if (!userId) {
      Alert.alert("Error", "User not found");
      return;
    }

    try {
      setLoadingWorkoutId(workout.id);

      const payload = {
        userId: Number(userId), // 🔥 FIX HERE
        workoutId: Number(workout.id), // optional but good practice
        date: new Date().toISOString(),
        durationCompleted: workout.duration,
      };

      const res = await Api.post("/workoutHistory", payload);

      dispatch(addWorkoutHistory(res.data));

      setAddedMap((prev) => ({
        ...prev,
        [workout.id]: true,
      }));

      Alert.alert("Success", "Workout added!");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoadingWorkoutId(null);
    }
  };

  const renderItem = ({ item }) => {
    const isLoading = loadingWorkoutId === item.id;
    const isAdded = addedMap[item.id];

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.name}</Text>

        <Text style={styles.text}>⏱ Duration: {item.duration} mins</Text>
        <Text style={styles.text}>🔥 Calories: {item.calories}</Text>
        <Text style={styles.text}>📊 Level: {item.level}</Text>

        <Pressable
          onPress={() => startWorkout(item)}
          disabled={isLoading || isAdded}
          style={[styles.button, (isLoading || isAdded) && { opacity: 0.6 }]}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Starting..." : isAdded ? "Added" : "Start Workout"}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Workouts</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={darkMode ? "#f8fafc" : "#111827"}
        />
      ) : workouts.length === 0 ? (
        <Text style={styles.emptyText}>No workouts available</Text>
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
        />
      )}

      <TouchableOpacity
        style={styles.dashboardBtn}
        onPress={() => navigation.navigate("DashBoard")}
      >
        <Text style={styles.buttonText}>Go to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (darkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
      backgroundColor: darkMode ? "#0f172a" : "#f5f5f5",
    },

    header: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 15,
      color: darkMode ? "#f8fafc" : "#111827",
    },

    card: {
      backgroundColor: darkMode ? "#1e293b" : "#fff",
      padding: 15,
      marginBottom: 12,
      borderRadius: 12,
      elevation: 3,
    },

    title: {
      fontSize: 17,
      fontWeight: "bold",
      marginBottom: 6,
      color: darkMode ? "#f8fafc" : "#111827",
    },

    text: {
      fontSize: 14,
      color: darkMode ? "#cbd5e1" : "#374151",
      marginTop: 2,
    },

    button: {
      marginTop: 12,
      backgroundColor: darkMode ? "#334155" : "#111827",
      padding: 10,
      borderRadius: 8,
      alignItems: "center",
    },

    dashboardBtn: {
      marginTop: 10,
      backgroundColor: darkMode ? "#2563eb" : "#2563EB",
      padding: 12,
      borderRadius: 10,
    },

    buttonText: {
      color: "#fff",
      textAlign: "center",
      fontWeight: "600",
    },

    emptyText: {
      textAlign: "center",
      marginTop: 20,
      color: darkMode ? "#cbd5e1" : "#6B7280",
      fontSize: 16,
    },
  });

export default WorkoutScreen;
