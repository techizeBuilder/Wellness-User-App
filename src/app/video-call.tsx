import AgoraUIKit from 'agora-rn-uikit';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import createAgoraRtcEngine, {
  ChannelMediaOptions,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  IRtcEngineEventHandler
} from 'react-native-agora';

type Params = {
  appId?: string | string[];
  channelName?: string | string[];
  token?: string | string[];
  uid?: string | string[];
  role?: string | string[];
  displayName?: string | string[];
  mediaType?: string | string[];
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
  const mediaTypeParam = (parseParam(params.mediaType) || 'video').toLowerCase();
  const sessionMediaType: 'audio' | 'video' = mediaTypeParam === 'audio' ? 'audio' : 'video';

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

  if (sessionMediaType === 'audio') {
    return (
      <AudioCallView
        appId={appId}
        channelName={channelName}
        token={token}
        uid={parseUid(uidParam)}
        role={role}
        displayName={displayName}
      />
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

type AudioCallProps = {
  appId: string;
  channelName: string;
  token: string;
  uid?: number;
  role?: string;
  displayName: string;
};

const AudioCallView: React.FC<AudioCallProps> = ({
  appId,
  channelName,
  token,
  uid,
  role,
  displayName
}) => {
  const engineRef = useRef<IRtcEngine | null>(null);
  const [joined, setJoined] = useState(false);
  const [remoteJoined, setRemoteJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const engine = createAgoraRtcEngine();
    engineRef.current = engine;

    const eventHandler: IRtcEngineEventHandler = {
      onJoinChannelSuccess: () => setJoined(true),
      onUserJoined: () => setRemoteJoined(true),
      onUserOffline: () => setRemoteJoined(false),
      onLeaveChannel: () => {
        setJoined(false);
        setRemoteJoined(false);
      },
      onError: (_err, msg) => {
        setError(msg || 'Unable to continue with the audio session.');
      }
    };

    try {
      engine.initialize({
        appId,
        channelProfile: ChannelProfileType.ChannelProfileCommunication
      });
      engine.registerEventHandler(eventHandler);
      engine.enableAudio();
      engine.disableVideo();
      engine.setEnableSpeakerphone(true);

      const options: ChannelMediaOptions = {
        channelProfile: ChannelProfileType.ChannelProfileCommunication,
        clientRoleType:
          role === 'host'
            ? ClientRoleType.ClientRoleBroadcaster
            : ClientRoleType.ClientRoleAudience,
        publishCameraTrack: false,
        publishMicrophoneTrack: true,
        autoSubscribeAudio: true,
        autoSubscribeVideo: false,
        enableAudioRecordingOrPlayout: true
      };

      engine.joinChannel(token || '', channelName, uid ?? 0, options);
    } catch (err) {
      console.error('Failed to initialise audio call', err);
      setError('Unable to start audio session. Please try again.');
    }

    return () => {
      try {
        engine.leaveChannel();
      } catch {}
      try {
        engine.unregisterEventHandler(eventHandler);
      } catch {}
      engine.release();
      engineRef.current = null;
    };
  }, [appId, channelName, token, uid, role]);

  const toggleMute = () => {
    const engine = engineRef.current;
    if (!engine) {
      return;
    }
    const nextMuted = !isMuted;
    engine.muteLocalAudioStream(nextMuted);
    setIsMuted(nextMuted);
  };

  const toggleSpeaker = () => {
    const engine = engineRef.current;
    if (!engine) {
      return;
    }
    const nextSpeaker = !isSpeakerOn;
    engine.setEnableSpeakerphone(nextSpeaker);
    setIsSpeakerOn(nextSpeaker);
  };

  const endCall = () => {
    const engine = engineRef.current;
    if (engine) {
      try {
        engine.leaveChannel();
      } catch {}
    }
    router.back();
  };

  const statusText = error
    ? error
    : joined
      ? remoteJoined
        ? 'Connected'
        : 'Waiting for the other participant...'
      : 'Connecting to audio session...';

  return (
    <View style={styles.audioContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.audioHeader}>
        <Text style={styles.audioBadge}>Audio Call</Text>
        <Text style={styles.audioTitle}>{displayName}</Text>
        <Text style={styles.audioSubtitle}>{statusText}</Text>
      </View>

      <View style={styles.audioControlRow}>
        <Pressable
          style={[styles.audioButton, isMuted && styles.audioButtonActive]}
          onPress={toggleMute}
        >
          <Text style={styles.audioButtonText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
        </Pressable>
        <Pressable
          style={[styles.audioButton, isSpeakerOn && styles.audioButtonActive]}
          onPress={toggleSpeaker}
        >
          <Text style={styles.audioButtonText}>{isSpeakerOn ? 'Speaker' : 'Earpiece'}</Text>
        </Pressable>
      </View>

      <Pressable style={styles.endCallButton} onPress={endCall}>
        <Text style={styles.endCallButtonText}>End Call</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  audioContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32
  },
  audioHeader: {
    alignItems: 'center',
    marginBottom: 32
  },
  audioBadge: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12
  },
  audioTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8
  },
  audioSubtitle: {
    color: '#D1D5DB',
    fontSize: 16,
    textAlign: 'center'
  },
  audioControlRow: {
    flexDirection: 'row',
    columnGap: 16,
    marginBottom: 32
  },
  audioButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#1F2937'
  },
  audioButtonActive: {
    backgroundColor: '#10B981'
  },
  audioButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  endCallButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 999,
    backgroundColor: '#EF4444'
  },
  endCallButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
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

