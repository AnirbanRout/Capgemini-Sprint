import React from "react";
import { View } from "react-native";
import StackNavigator from "../navigation/StackNavigator";

import { NavigationContainer } from "@react-navigation/native";

const HealthTrack = () => {
  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <StackNavigator />
      </View>
    </NavigationContainer>
  );
};

export default HealthTrack;
