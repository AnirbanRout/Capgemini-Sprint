import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Api from "../api/Api";

const filters = ["All", "Breakfast", "Lunch", "Dinner", "Snacks"];

const NutritionScreen = ({ navigation }) => {
  const [nutrition, setNutrition] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const getNutrition = async () => {
    try {
      const res = await Api.get("/nutrition");
      setNutrition(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getNutrition();
  }, []);

  // Filter logic
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
      case "Snacks":
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

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Mark as Eaten</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
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

      {/* List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
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
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
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
    marginBottom: 2,
  },

  button: {
    marginTop: 10,
    backgroundColor: "#111827",
    padding: 10,
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

export default NutritionScreen;
