/*
import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
// import CupertinoFooter1 from "../components/CupertinoFooter1";
import Svg, { Ellipse } from "react-native-svg";
import Icon from "react-native-vector-icons/FontAwesome";

function ProofTrackHomepage(props: any) {
  return (
    <View style={styles.container}>
      <View style={styles.functionsFooterColumn}>
        <CupertinoFooter1 style={styles.functionsFooter}></CupertinoFooter1>
        <Text style={styles.welcomeUser}>Welcome, {"{"}user{"}"}!</Text>
      </View>
      <View style={styles.functionsFooterColumnFiller}></View>
      <TouchableOpacity style={styles.submitProofBtn}>
        <View style={styles.ellipseStack}>
          <Svg viewBox="0 0 124.71 125.02" style={styles.ellipse}>
            <Ellipse
              stroke="rgba(230, 230, 230,1)"
              strokeWidth={0}
              fill="rgba(74,144,226,1)"
              cx={62}
              cy={63}
              rx={62}
              ry={63}
            ></Ellipse>
          </Svg>
          <Icon name="camera" style={styles.icon}></Icon>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  functionsFooter: {
    height: 94,
    width: 375,
    backgroundColor: "rgba(226,226,226,1)",
    marginTop: 630
  },
  welcomeUser: {
    fontFamily: "roboto-700",
    color: "#121212",
    fontSize: 36,
    marginTop: -724,
    marginLeft: 52
  },
  functionsFooterColumn: {
    width: 375,
    marginTop: 88
  },
  functionsFooterColumnFiller: {
    flex: 1
  },
  submitProofBtn: {
    width: 125,
    height: 125,
    marginBottom: 100,
    marginLeft: 125
  },
  ellipse: {
    top: 0,
    left: 0,
    width: 125,
    height: 125,
    position: "absolute"
  },
  icon: {
    top: 43,
    left: 41,
    position: "absolute",
    color: "rgba(255,255,255,1)",
    fontSize: 40
  },
  ellipseStack: {
    width: 125,
    height: 125
  }
});

export default ProofTrackHomepage; */