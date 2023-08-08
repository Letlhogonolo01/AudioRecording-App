import React from "react";
import { View, Text, Button, ImageBackground, StyleSheet } from "react-native";

const Welcome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/bg-image.jpg")}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Welcome to My Audio Recorder</Text>
          <Button
            title="Lets Get Started"
            onPress={() => navigation.navigate("Recording")}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "white",
    marginBottom: 16,
  },
});

export default Welcome;
