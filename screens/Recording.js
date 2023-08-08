import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Audio } from "expo-av";
import { Alert } from "react-native";
import { addRecording, deleteRecording } from "../store/recordingsSlice";

const Recording = ({ navigation }) => {
  const dispatch = useDispatch();
  const recordings = useSelector((state) => state.recordings);
  const [recording, setRecording] = React.useState();
  const [message, setMessage] = React.useState("");

  const [userDetails, setUserDetails] = React.useState();
  React.useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const userData = await AsyncStorage.getItem("userData");
    if (userData) {
      setUserDetails(JSON.parse(userData));
    }
  };

  const logout = () => {
    AsyncStorage.setItem(
      "userData",
      JSON.stringify({ ...userDetails, loggedIn: false })
    );
    navigation.navigate("LoginScreen");
  };

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );

        setRecording(recording);
      } else {
        setMessage("Please grant permission to app to access microphone");
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();

    const status = await recording.getStatusAsync(); // Get the recording status
    const newRecording = {
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI(),
    };

    dispatch(addRecording(newRecording));
  }

  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>
            Recording {index + 1} - {recordingLine.duration}
          </Text>
          <Button
            style={styles.button}
            onPress={() => handlePlay(recordingLine.file)}
            title="Play"
          ></Button>
          <Button
            style={styles.button}
            onPress={() => handleDelete(index)}
            title="Delete"
          ></Button>
        </View>
      );
    });
  }

  async function handlePlay(file) {
    const sound = new Audio.Sound();
    try {
      await sound.loadAsync({ uri: file });
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound", error);
    }
  }

  async function handleDelete(index) {
    Alert.alert(
      "Delete Recording",
      "Are you sure you want to delete this recording?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(deleteRecording(index));
          },
        },
      ]
    );
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>
          Welcome {userDetails?.fullname}
        </Text>
        <Text>{message}</Text>
        <Button
          title={recording ? "Stop Recording" : "Start Recording"}
          onPress={recording ? stopRecording : startRecording}
        />
        {getRecordingLines()}
      </View>
      <View>
        <Button title="Logout" onPress={logout} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fill: {
    flex: 1,
    margin: 16,
  },
  button: {
    margin: 10,
  },
});

export default Recording;
