import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Api from "../api/Api";
import { addWorkoutHistory } from "../redux/slice/WorkoutSlice";

const WorkoutScreen = ({ navigation }) => {
  const userData = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 👇 per-button loading fix
  const [loadingWorkoutId, setLoadingWorkoutId] = useState(null);

  const userId = userData?.user?.id;

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
        userId: userId,
        workoutId: workout.id,
        date: new Date().toISOString(),
        durationCompleted: workout.duration,
      };

      const res = await Api.post("/workoutHistory", payload);

      dispatch(addWorkoutHistory(res.data));

      Alert.alert("Success", "Workout added to history!");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoadingWorkoutId(null);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>

      <Text style={styles.text}>⏱ Duration: {item.duration} mins</Text>
      <Text style={styles.text}>🔥 Calories: {item.calories} kcal</Text>
      <Text style={styles.text}>📊 Level: {item.level}</Text>

      <TouchableOpacity
        onPress={() => startWorkout(item)}
        style={[
          styles.button,
          loadingWorkoutId === item.id && { opacity: 0.6 },
        ]}
        disabled={loadingWorkoutId === item.id}
      >
        <Text style={styles.buttonText}>
          {loadingWorkoutId === item.id ? "Starting..." : "Start Workout"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Workouts</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#111827" />
      ) : workouts.length === 0 ? (
        <Text style={styles.emptyText}>No workouts available</Text>
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
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

export default WorkoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#111827",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
  },

  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#111827",
  },

  text: {
    fontSize: 14,
    color: "#374151",
    marginTop: 2,
  },

  button: {
    marginTop: 12,
    backgroundColor: "#111827",
    padding: 10,
    borderRadius: 8,
  },

  dashboardBtn: {
    marginTop: 10,
    backgroundColor: "#2563EB",
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
    color: "#6B7280",
    fontSize: 16,
  },
});
