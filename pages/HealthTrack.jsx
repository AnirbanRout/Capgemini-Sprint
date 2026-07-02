import React from "react";
import { View } from "react-native";
import StackNavigator from "../navigation/StackNavigator";

import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { useSelector } from "react-redux";

const HealthTrack = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);

  return (
    <NavigationContainer theme={darkMode ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        <StackNavigator />
      </View>
    </NavigationContainer>
  );
};

export default HealthTrack;
