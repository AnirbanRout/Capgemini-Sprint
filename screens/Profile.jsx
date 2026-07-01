import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Api from "../api/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "../redux/slice/AuthSlice";

const ProfileScreen = ({ navigation }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [history, setHistory] = useState([]);

  const getHistory = async () => {
    try {
      const res = await Api.get(`/workoutHistory?userId=${user.id}`);
      setHistory(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  const totalWorkouts = history.length;

  const lastWorkout =
    history.length > 0 ? history[history.length - 1].date.split("T")[0] : "N/A";

  const logoutHandler = async () => {
    await AsyncStorage.clear();
    dispatch(logout());
    navigation.replace("Login");
  };

  const renderItem = ({ item }) => (
    <View style={styles.historyCard}>
      <View style={styles.historyTopRow}>
        <Text style={styles.icon}>🏋️</Text>

        <View style={{ flex: 1 }}>
          <Text style={styles.historyTitle}>Workout #{item.workoutId}</Text>

          <Text style={styles.historyDate}>📅 {item.date.split("T")[0]}</Text>
        </View>
      </View>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>⏱ {item.durationCompleted} min</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Image
          source={{ uri: user.profilePhoto || "https://i.pravatar.cc/150" }}
          style={styles.image}
        />

        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>

        <Text style={styles.meta}>
          Age {user.age} • {user.weight}kg • {user.height}cm
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalWorkouts}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{lastWorkout}</Text>
          <Text style={styles.statLabel}>Last Active</Text>
        </View>
      </View>

      {/* History */}
      <Text style={styles.sectionTitle}>Workout History</Text>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logoutHandler}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 15,
  },

  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    elevation: 3,
    marginBottom: 15,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },

  email: {
    color: "#6b7280",
    marginTop: 2,
  },

  meta: {
    marginTop: 6,
    fontSize: 12,
    color: "#374151",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: "center",
  },

  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },

  statLabel: {
    fontSize: 12,
    color: "#d1d5db",
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#111827",
  },

  historyCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },

  historyTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  icon: {
    fontSize: 24,
    marginRight: 10,
  },

  historyTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111827",
  },

  historyDate: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },

  badge: {
    backgroundColor: "#111827",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  logoutBtn: {
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ProfileScreen;
