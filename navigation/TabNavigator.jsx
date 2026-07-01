import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import DashBoard from "../screens/DashBoard";
import Workouts from "../screens/Workouts";
import Profile from "../screens/Profile";

import Nutrition from "../screens/Nutrition";
import OutdoorRun from "../screens/OutdoorRun";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="DashBoard">
      <Tab.Screen name="DashBoard" component={DashBoard} />
      <Tab.Screen name="Workouts" component={Workouts} />
      <Tab.Screen name="Nutrition" component={Nutrition} />
      <Tab.Screen name="OutdoorRun" component={OutdoorRun} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
