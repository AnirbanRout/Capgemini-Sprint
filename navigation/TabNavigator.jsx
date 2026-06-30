import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import DashBoard from "../screens/DashBoard";
import Workouts from "../screens/Workouts";
import Profile from "../screens/Profile";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="Dashboard">
      <Tab.Screen name="Dashboard" component={DashBoard} />
      <Tab.Screen name="Workouts" component={Workouts} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
