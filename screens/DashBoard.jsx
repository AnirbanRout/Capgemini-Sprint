import React from "react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { View, Text } from "react-native";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";

import Api from "../api/Api";

const DashBoard = ({ navigation }) => {
  const userData = useSelector((state) => {
    return state.auth;
  });

  const [workoutData, setWorkoutData] = React.useState([]);

  const getWorkoutData = async () => {
    try {
      const response = await Api.get(
        `/workoutHistory?userId=${userData.user.id}`,
      );
      const data = response.data;
      setWorkoutData(data);
    } catch (error) {
      console.error("Error fetching workout data:", error);
    }
  };

  useEffect(() => {
    getWorkoutData();
  }, []);

  return (
    <View>
      <Text>Welcome {userData.user.name}</Text>
      <Text>Workout Data: {workoutData.length}</Text>
      {/* 
      {workoutData.length === 0 && <Text>No workout data available.</Text>} */}

      <FlatList
        data={workoutData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            <Text>{item.date}</Text>
            <Text>{item.durationCompleted}</Text>
          </View>
        )}
      />
    </View>
  );
};
export default DashBoard;
