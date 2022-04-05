import React, { useRef } from "react";
import { Pressable, ScrollView, Text, StyleSheet } from "react-native";
import { Colors, Spacing } from "../utils";
import { Toast, ToastRef } from "./Toast";

export default function ToastView() {
  const toastRef = useRef<ToastRef>(null);

  return (
    <>
      <Toast ref={toastRef} />
      <ScrollView
        style={{ backgroundColor: Colors.SurfaceBackground }}
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Success */}
        <Pressable
          style={[styles.button, styles.success]}
          onPress={() => {
            toastRef.current?.show({
              type: "success",
              message: "Tweet added to your Bookmarks",
            });
          }}
        >
          <Text style={styles.buttonText}>Show success toast</Text>
        </Pressable>

        {/* Informative */}
        <Pressable
          style={[styles.button, styles.informative]}
          onPress={() => {
            toastRef.current?.show({
              type: "informative",
              message: "Tweet was added to your Bookmarks",
            });
          }}
        >
          <Text style={styles.buttonText}>Show information toast</Text>
        </Pressable>

        {/* Error */}
        <Pressable
          style={[styles.button, styles.error]}
          onPress={() => {
            toastRef.current?.show({
              type: "error",
              message: "Could not add tweet to Bookmarks",
              actionTitle: "Try again",
              onPress: () => {
                console.log("========== File: index.tsx, Line: 50 ==========");
              },
            });
          }}
        >
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
