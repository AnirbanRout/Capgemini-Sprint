import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useSelector } from "react-redux";
import Api from "../api/Api";
import { StyleSheet } from "react-native";

const OutdoorRun = () => {
  const user = useSelector((state) => state.auth.user);
  const darkMode = useSelector((state) => state.theme.darkMode);

  const [run, setRun] = useState(null);
  const [loading, setLoading] = useState(true);

  const styles = createStyles(darkMode);

  useEffect(() => {
    getRun();
  }, []);

  const getRun = async () => {
    try {
      const res = await Api.get(`/outdoorRuns?userId=${user.id}`);

      if (res.data.length > 0) {
        setRun(res.data[0]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const startRun = async () => {
    Alert.alert(
      "Outdoor Run",
      "This screen is currently showing your saved outdoor run from JSON Server.",
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading Map...</Text>
      </View>
    );
  }

  if (!run) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No outdoor run found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Outdoor Run</Text>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: run.routeCoordinates[0].latitude,
          longitude: run.routeCoordinates[0].longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {run.routeCoordinates.map((point, index) => (
          <Marker key={index} coordinate={point} title={`Point ${index + 1}`} />
        ))}

        <Polyline
          coordinates={run.routeCoordinates}
          strokeWidth={4}
          strokeColor={darkMode ? "#60a5fa" : "blue"}
        />
      </MapView>

      <Text style={styles.locationText}>📅 Date: {run.date}</Text>

      <Text style={styles.locationText}>🏃 Distance: {run.distanceKm} km</Text>

      <Text style={styles.locationText}>
        ⏱ Duration: {run.durationMinutes} min
      </Text>

      <TouchableOpacity style={styles.runBtn} onPress={startRun}>
        <Text style={styles.runBtnText}>View Saved Run</Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (darkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkMode ? "#0f172a" : "#f3f4f6",
      padding: 15,
    },

    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: darkMode ? "#0f172a" : "#f3f4f6",
    },

    loadingText: {
      color: darkMode ? "#f8fafc" : "#111827",
    },

    heading: {
      fontSize: 22,
      fontWeight: "bold",
      color: darkMode ? "#f8fafc" : "#111827",
      marginBottom: 15,
      textAlign: "center",
    },

    map: {
      width: "100%",
      height: 400,
      borderRadius: 12,
      marginBottom: 20,
    },

    locationText: {
      fontSize: 15,
      color: darkMode ? "#cbd5e1" : "#374151",
      marginBottom: 8,
      fontWeight: "500",
    },

    runBtn: {
      backgroundColor: darkMode ? "#2563eb" : "#2563eb",
      padding: 14,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 20,
    },

    runBtnText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
  });

export default OutdoorRun;
