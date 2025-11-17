import AgoraUIKit from 'agora-rn-uikit';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { ChannelProfileType, ClientRoleType } from 'react-native-agora';

type Params = {
  appId?: string | string[];
  channelName?: string | string[];
  token?: string | string[];
  uid?: string | string[];
  role?: string | string[];
  displayName?: string | string[];
};

const parseParam = (value?: string | string[]) => {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === undefined) {
    return undefined;
  }
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
};

const parseUid = (value?: string) => {
  if (!value) return undefined;
  const numeric = Number(value);
  if (!Number.isNaN(numeric)) {
    return numeric;
  }
  return undefined;
};

export default function VideoCallScreen() {
  const params = useLocalSearchParams<Params>();
  const appId = parseParam(params.appId);
  const channelName = parseParam(params.channelName);
  const token = parseParam(params.token);
  const uidParam = parseParam(params.uid);
  const role = parseParam(params.role);
  const displayName = decodeURIComponent(parseParam(params.displayName) || 'Participant');

  const [inCall, setInCall] = useState(true);

  const connectionData = useMemo(() => {
    if (!appId || !channelName || !token) {
      return null;
    }
    return {
      appId,
      channel: channelName,
      rtcToken: token,
      rtcUid: parseUid(uidParam),
      username: displayName
    };
  }, [appId, channelName, token, uidParam, displayName]);

  const settings = useMemo(() => {
    return {
      role: ClientRoleType.ClientRoleBroadcaster,
      mode: ChannelProfileType.ChannelProfileLiveBroadcasting,
      disableRtm: false
    };
  }, []);

  if (!appId || !channelName || !token || !connectionData) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <Text style={styles.errorTitle}>Unable to start call</Text>
        <Text style={styles.errorMessage}>Missing Agora credentials.</Text>
        <Pressable style={styles.errorButton} onPress={() => router.back()}>
          <Text style={styles.errorButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      {inCall ? (
        <AgoraUIKit
          connectionData={connectionData}
          settings={settings}
          rtcCallbacks={{
            EndCall: () => {
              setInCall(false);
              router.back();
            }
          }}
        />
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Call ended</Text>
          <Pressable style={styles.errorButton} onPress={() => router.back()}>
            <Text style={styles.errorButtonText}>Go Back</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#000'
  },
  errorTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center'
  },
  errorMessage: {
    color: '#E5E7EB',
    fontSize: 14,
    textAlign: 'center'
  },
  errorButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#10B981'
  },
  errorButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  }
});

