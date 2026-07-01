import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import React from "react";
import Store from "./redux/Store";

import { Provider } from "react-redux";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import HealthTrack from "./pages/HealthTrack";

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={[]}>
        <Provider store={Store}>
          <HealthTrack />
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
