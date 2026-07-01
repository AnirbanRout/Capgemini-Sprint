import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Api from "../api/Api";
import { addEatenMeal } from "../redux/slice/WorkoutSlice";
import { useSelector, useDispatch } from "react-redux";

const filters = ["All", "Breakfast", "Lunch", "Dinner", "Snack"];

const Nutrition = ({ navigation }) => {
  const [nutrition, setNutrition] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [loadingId, setLoadingId] = useState(null);

  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const eatenMeals = useSelector((state) => state.workout.eatenMeals);

  useEffect(() => {
    const getNutrition = async () => {
      try {
        const res = await Api.get("/nutrition");
        setNutrition(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getNutrition();
  }, []);

  // ✅ FIXED: consistent id check
  const isAdded = (item) => eatenMeals.some((m) => m.id === item.id);

  const markAsEaten = (item) => {
    if (!user?.id) {
      Alert.alert("Error", "User not found");
      return;
    }

    if (isAdded(item)) return;

    setLoadingId(item.id);

    try {
      const payload = {
        id: item.id, // ✅ IMPORTANT: consistent with Redux slice
        userId: Number(user.id),
        mealName: item.meal,
        type: item.type,
        calories: item.calories,
        protein: item.protein,
        date: new Date().toISOString(),
      };

      dispatch(addEatenMeal(payload));

      Alert.alert("Success", `${item.meal} marked as eaten`);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoadingId(null);
    }
  };

  const filteredData =
    selectedFilter === "All"
      ? nutrition
      : nutrition.filter((item) => item.type === selectedFilter);

  const getIcon = (type) => {
    switch (type) {
      case "Breakfast":
        return "🍳";
      case "Lunch":
        return "🥗";
      case "Dinner":
        return "🍛";
      case "Snack":
        return "🍪";
      default:
        return "🍽";
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>
        {getIcon(item.type)} {item.meal}
      </Text>

      <Text style={styles.text}>Type: {item.type}</Text>
      <Text style={styles.text}>🔥 Calories: {item.calories}</Text>
      <Text style={styles.text}>💪 Protein: {item.protein}g</Text>

      <TouchableOpacity
        style={[
          styles.button,
          (loadingId === item.id || isAdded(item)) && { opacity: 0.6 },
        ]}
        onPress={() => markAsEaten(item)}
        disabled={loadingId === item.id || isAdded(item)}
      >
        <Text style={styles.buttonText}>
          {loadingId === item.id
            ? "Adding..."
            : isAdded(item)
              ? "Added"
              : "Mark as Eaten"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nutrition Plans</Text>
      <Text style={styles.subHeader}>Track your daily meals</Text>

      {/* Filters */}
      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setSelectedFilter(f)}
            style={[
              styles.filterChip,
              selectedFilter === f && styles.activeChip,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === f && styles.activeText,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => navigation.navigate("DashBoard")}
      >
        <Text style={styles.logoutText}>Go to Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => navigation.navigate("Workouts")}
      >
        <Text style={styles.logoutText}>Go to Workouts</Text>
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

  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },

  subHeader: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 10,
  },

  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },

  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#e5e7eb",
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  activeChip: {
    backgroundColor: "#111827",
  },

  filterText: {
    fontSize: 12,
    color: "#374151",
  },

  activeText: {
    color: "#fff",
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 3,
  },

  title: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#111827",
  },

  text: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 3,
  },

  button: {
    marginTop: 10,
    backgroundColor: "#111827",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },

  logoutBtn: {
    backgroundColor: "#111827",
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

export default Nutrition;
