import React from "react";
import { Pressable, ScrollView, Text, StyleSheet } from "react-native";
import { Colors, Spacing } from "../utils";
import { Toast } from "./Toast";

export default function ToastView() {
  return (
    <>
      <Toast />
      <ScrollView
        style={{ backgroundColor: Colors.SurfaceBackground }}
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Pressable style={[styles.button, styles.success]}>
          <Text style={styles.buttonText}>Show success toast</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.informative]}>
          <Text style={styles.buttonText}>Show information toast</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.error]}>
          <Text style={styles.buttonText}>Show error toast</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 250,
    height: 60,
    borderRadius: 10,
    marginBottom: Spacing.defaultMargin,
  },
  success: {
    backgroundColor: Colors.SurfaceSuccess,
  },
  informative: {
    backgroundColor: Colors.SurfaceNeutral,
  },
  error: {
    backgroundColor: Colors.SurfaceCritical,
  },
  buttonText: {
    color: Colors.TextInteractive,
  },
});
