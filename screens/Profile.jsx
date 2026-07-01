import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Api from "../api/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

import { login, logout } from "../redux/slice/AuthSlice";

const ProfileScreen = ({ navigation }) => {
  const user = useSelector((state) => state.auth.user);
  const eatenMeals = useSelector((state) => state.workout.eatenMeals);

  const token = useSelector((state) => state.auth.token);

  const dispatch = useDispatch();

  const [history, setHistory] = useState([]);
  const [profileImage, setProfileImage] = useState(user?.profilePhoto || "");

  const getHistory = async () => {
    try {
      if (!user?.id) return;

      const res = await Api.get(`/workoutHistory?userId=${user.id}`);
      setHistory(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (user?.id) getHistory();
    }, [user?.id]),
  );

  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const totalWorkouts = history.length;

  const lastWorkout =
    sortedHistory.length > 0 ? sortedHistory[0].date.split("T")[0] : "N/A";

  const logoutHandler = async () => {
    await AsyncStorage.clear();
    dispatch(logout());
    navigation.replace("Login");
  };

  //gallery picker
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission Denied", "Gallery permission is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;

      try {
        await Api.patch(`/users/${user.id}`, {
          profilePhoto: imageUri,
        });

        const updatedUser = {
          ...user,
          profilePhoto: imageUri,
        };

        setProfileImage(imageUri);

        dispatch(
          login({
            user: updatedUser,
            token,
          }),
        );

        await AsyncStorage.setItem(
          "auth",
          JSON.stringify({
            user: updatedUser,
            token,
          }),
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  //camera picker
  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission Denied", "Camera permission is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;

      try {
        await Api.patch(`/users/${user.id}`, {
          profilePhoto: imageUri,
        });

        const updatedUser = {
          ...user,
          profilePhoto: imageUri,
        };

        setProfileImage(imageUri);

        dispatch(
          login({
            user: updatedUser,
            token,
          }),
        );

        await AsyncStorage.setItem(
          "auth",
          JSON.stringify({
            user: updatedUser,
            token,
          }),
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  // WORKOUT ITEM
  const renderWorkout = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.icon}>🏋️</Text>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Workout #{item.workoutId}</Text>

          <Text style={styles.date}>📅 {item.date.split("T")[0]}</Text>
        </View>
      </View>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>⏱ {item.durationCompleted} min</Text>
      </View>
    </View>
  );

  // MEAL ITEM
  const renderMeal = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.icon}>🍽️</Text>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.mealName}</Text>

          <Text style={styles.date}>📅 {item.date?.split("T")[0]}</Text>
        </View>
      </View>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>🔥 {item.calories} kcal</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* PROFILE CARD */}
      <View style={styles.profileCard}>
        <Image
          source={{
            uri: profileImage || "https://i.pravatar.cc/150",
          }}
          style={styles.image}
        />

        <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
          <Text style={styles.imageBtnText}>Choose from Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.imageBtn} onPress={takePhoto}>
          <Text style={styles.imageBtnText}>Take Photo</Text>
        </TouchableOpacity>

        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <Text style={styles.meta}>
          Age {user?.age} • {user?.weight}kg • {user?.height}cm
        </Text>
      </View>

      {/* STATS */}
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

      {/* WORKOUT HISTORY */}
      <Text style={styles.sectionTitle}>Workout History</Text>

      <FlatList
        data={sortedHistory}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderWorkout}
      />

      {/* NUTRITION HISTORY */}
      <Text style={styles.sectionTitle}>Nutrition History</Text>

      <FlatList
        data={eatenMeals}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderMeal}
      />

      {/* LOGOUT */}
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
    marginTop: 10,
    color: "#111827",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  icon: {
    fontSize: 24,
    marginRight: 10,
  },

  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111827",
  },

  date: {
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

  imageBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
    width: "100%",
    alignItems: "center",
  },

  imageBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
