import React, { useEffect, useRef, useState } from "react";
import {
    Popover,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider,
    Box,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useMeetingAppContext } from "../MeetingAppContextDef";
import useIsMobile from "../utils/useIsMobile";
import { ChevronDownIcon, DropMIC, PauseButton, SelectedIcon, TestMic, TestMicOff } from "../icons";

// Styled components
const StyledPopoverButton = styled(Button)(({ theme, isOpen, isHovered, disabled }) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: 400,
    textTransform: "none",
    color: isOpen ? "#FFF" : "#B4B4B4",
    backgroundColor: isOpen ? "#000" : "transparent",
    border: "none",
    outline: isOpen ? "1px solid #6B7280" : "none",
    opacity: disabled ? 0.5 : 1,
    "&:hover": {
        backgroundColor: disabled ? "transparent" : "#000",
        border: disabled ? "none" : "1px solid #E5E5E5",
        outline: disabled ? "none" : "1px solid #6B7280",
    },
    // "&:hover": {
    //     backgroundColor: disabled ? "transparent" : "#000",
    //     border: disabled ? "none" : "1px solid #E5E5E5",
    //     color: disabled ? "#B4B4B4" : "#FFF",
    // },
    "&:focus": {
        outline: "none",
    },
    "&.Mui-disabled": {
        color: "#B4B4B4",
    },
}));

const StyledPopover = styled(Popover)(({ theme }) => ({
    "& .MuiPaper-root": {
        backgroundColor: "#2D2D2D",
        borderRadius: "8px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
        marginBottom: "8px",
    },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
    padding: "4px 16px 4px 8px",
    color: "#FFF",
}));

const RecordButton = styled(Button)(({ theme }) => ({
    padding: "4px 8px",
    fontSize: "12px",
    borderRadius: "4px",
    backgroundColor: "#6F767E",
    color: "#FFF",
    textTransform: "none",
    "&:hover": {
        backgroundColor: "#5A6169",
    },
}));

const ProgressButton = styled(Button)(({ theme, isMobile, isSmallScreen }) => ({
    padding: "8px 16px",
    fontSize: "12px",
    borderRadius: "4px",
    backgroundColor: "#6F767E",
    color: "#FFF",
    textTransform: "none",
    position: "relative",
    width: isMobile || isSmallScreen ? "50%" : "80%",
    height: "30px",
    overflow: "hidden",
    "&:hover": {
        backgroundColor: "#5A6169",
    },
}));

export default function DropDown({
    mics,
    changeMic,
    customAudioStream,
    audioTrack,
    micOn,
    didDeviceChange,
    setDidDeviceChange,
    selectedMic: selectedMicProp,
    setSelectedMic: setSelectedMicProp,
    selectedSpeaker: selectedSpeakerProp,
    isMicrophonePermissionAllowed,
}) {
    const ctx = useMeetingAppContext();

    const setSelectedMic = setSelectedMicProp ?? ctx?.setSelectedMic ?? (() => { });
    const selectedMic = selectedMicProp ?? ctx?.selectedMic ?? {};
    const selectedSpeaker = selectedSpeakerProp ?? ctx?.selectedSpeaker ?? {};

    const [audioProgress, setAudioProgress] = useState(0);
    const [recordingProgress, setRecordingProgress] = useState(0);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [volume, setVolume] = useState(null);
    const [audio, setAudio] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMobile = useIsMobile();
    const isSmallScreen = useIsMobile(900);
    const isLargeScreen = useIsMobile(1150);
    const anchorWidthRef = useRef(null);
    const open = Boolean(anchorEl);
    const audioTrackRef = useRef();
    const intervalRef = useRef();
    const audioAnalyserIntervalRef = useRef();
    const audioContextRef = useRef(null);
    const mediaRecorder = useRef(null);
    const stopTimeoutRef = useRef(null);

    const mimeType = "audio/webm";

    useEffect(() => {
        audioTrackRef.current = audioTrack;

        if (audioTrack) {
            analyseAudio(audioTrack);
        } else {
            stopAudioAnalyse();
        }

        return () => {
            stopAudioAnalyse();
        };
    }, [audioTrack]);

    useEffect(() => {
        if (didDeviceChange) {
            setDidDeviceChange(false);
            if (
                mediaRecorder.current != null &&
                mediaRecorder.current.state === "recording"
            ) {
                stopRecording();
            }
            setRecordingProgress(0);
            setRecordingStatus("inactive");
        }
    }, [didDeviceChange]);

    const analyseAudio = (audioTrack) => {
        if (audioContextRef.current) {
            audioContextRef.current.close().catch(() => { });
            audioContextRef.current = null;
        }

        const audioStream = new MediaStream([audioTrack]);
        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;
        const audioSource = audioContext.createMediaStreamSource(audioStream);
        const analyser = audioContext.createAnalyser();

        analyser.fftSize = 512;
        analyser.minDecibels = -127;
        analyser.maxDecibels = 0;
        analyser.smoothingTimeConstant = 0.4;

        audioSource.connect(analyser);

        const volumes = new Uint8Array(analyser.frequencyBinCount);
        const volumeCallback = () => {
            analyser.getByteFrequencyData(volumes);
            const volumeSum = volumes.reduce((sum, vol) => sum + vol);
            const averageVolume = volumeSum / volumes.length;
            setVolume(averageVolume);
        };
        audioAnalyserIntervalRef.current = setInterval(volumeCallback, 100);
    };

    const stopAudioAnalyse = () => {
        clearInterval(audioAnalyserIntervalRef.current);
        if (audioContextRef.current) {
            audioContextRef.current.close().catch(() => { });
            audioContextRef.current = null;
        }
    };

    const audioRef = useRef(null);
    const timeupdateHandlerRef = useRef(null);
    const endedHandlerRef = useRef(null);

    const cleanupAudioListeners = () => {
        if (audioRef.current) {
            if (timeupdateHandlerRef.current) {
                audioRef.current.removeEventListener("timeupdate", timeupdateHandlerRef.current);
            }
            if (endedHandlerRef.current) {
                audioRef.current.removeEventListener("ended", endedHandlerRef.current);
            }
        }
        timeupdateHandlerRef.current = null;
        endedHandlerRef.current = null;
    };

    const handlePlaying = () => {
        if (recordingStatus === "playing") {
            // Pause playback
            if (audioRef.current) {
                audioRef.current.pause();
            }
            cleanupAudioListeners();
            setAudioProgress(0);
            setRecordingStatus("stopped recording");
            return;
        }

        setRecordingStatus("playing");
        setAudioProgress(0);

        const audioTags = document.getElementsByTagName("audio");
        for (let i = 0; i < audioTags.length; i++) {
            const tag = audioTags.item(i);
            cleanupAudioListeners();
            audioRef.current = tag;

            const onTimeUpdate = () => {
                const progress =
                    (tag.currentTime / recordingDuration) * 100;
                setAudioProgress(progress);
            };

            const onEnded = () => {
                setAudioProgress(0);
                setRecordingStatus("stopped recording");
                cleanupAudioListeners();
            };

            timeupdateHandlerRef.current = onTimeUpdate;
            endedHandlerRef.current = onEnded;

            const playSrc = () => {
                tag.play();
                tag.addEventListener("timeupdate", onTimeUpdate);
                tag.addEventListener("ended", onEnded);
            };
            if (tag.setSinkId && selectedSpeaker?.id) {
                tag.setSinkId(selectedSpeaker.id).then(playSrc).catch(playSrc);
            } else {
                playSrc();
            }
        }
    };

    const startRecording = async () => {
        setRecordingStatus("recording");
        setRecordingProgress(0);

        try {
            const streamToRecord =
                customAudioStream instanceof MediaStream
                    ? customAudioStream
                    : audioTrack
                        ? new MediaStream([audioTrack])
                        : null;

            if (!streamToRecord) {
                console.warn("No audio stream available for recording.");
                setRecordingStatus("inactive");
                return;
            }

            const media = new MediaRecorder(streamToRecord, { mimeType });
            mediaRecorder.current = media;
            mediaRecorder.current.start();
            let localAudioChunks = [];

            mediaRecorder.current.ondataavailable = (event) => {
                if (typeof event.data === "undefined") return;
                if (event.data.size === 0) return;
                localAudioChunks.push(event.data);
            };

            const startTime = Date.now();
            const DURATION = 5000;

            mediaRecorder.current.onstop = () => {
                const audioBlob = new Blob(localAudioChunks, { type: mimeType });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudio(audioUrl);
                localAudioChunks = [];
                const elapsedTime = Date.now() - startTime;
                setRecordingDuration(elapsedTime / 1000);
            };

            // Update progress every 100ms
            intervalRef.current = setInterval(() => {
                const elapsedTime = Date.now() - startTime;
                const progress = Math.min((elapsedTime / DURATION) * 100, 100);
                setRecordingProgress(progress);
            }, 100);

            // Auto-stop after DURATION
            stopTimeoutRef.current = setTimeout(() => {
                clearInterval(intervalRef.current);
                stopRecording();
            }, DURATION);
        } catch (err) {
            console.log("Error in MediaRecorder:", err);
            setRecordingStatus("inactive");
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
            clearInterval(intervalRef.current);
            clearTimeout(stopTimeoutRef.current);
            setRecordingProgress(0);
            setRecordingStatus("stopped recording");
            mediaRecorder.current.stop();
        }
    };

    const handleClick = (event) => {
        anchorWidthRef.current = event.currentTarget.offsetWidth;
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        if (
            mediaRecorder.current != null &&
            mediaRecorder.current.state === "recording"
        ) {
            stopRecording();
        }
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setRecordingProgress(0);
        setAudioProgress(0);
        setRecordingStatus("inactive");
        cleanupAudioListeners();
    };
    return (
        <Box sx={{ width: "100%", cursor: isMicrophonePermissionAllowed === true ? "pointer" : "not-allowed" }}>
            <StyledPopoverButton
                onMouseEnter={() => isMicrophonePermissionAllowed === true ? setIsHovered(true) : null}
                onMouseLeave={() => setIsHovered(false)}
                disabled={isMicrophonePermissionAllowed !== true}
                isOpen={open}
                isHovered={isHovered}
                onClick={isMicrophonePermissionAllowed === true ? handleClick : undefined}
                sx={{ pointerEvents: isMicrophonePermissionAllowed === true ? "auto" : "none" }}
            >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                    <DropMIC
                        fillColor={isHovered || open ? "#FFF" : "#B4B4B4"}
                        style={{
                            marginBottom: "2px",
                        }} />
                    <Typography
                        sx={{
                            ml: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            flex: 1,
                        }}
                    >
                        {isMicrophonePermissionAllowed === true
                            ? selectedMic?.label
                            : "Permission Needed"}
                    </Typography>
                    <ChevronDownIcon
                        style={{
                            marginLeft: "10px",
                            height: "20px",
                            width: "20px",
                            // marginTop: "4px",
                            color: open ? "#FFF" : "#B4B4B4",
                        }}
                    />
                </Box>
            </StyledPopoverButton>

            <StyledPopover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                sx={{
                    "& .MuiPaper-root": {
                        width: anchorWidthRef.current ?? "auto",
                    },
                }}
            >
                <List sx={{ py: 0 }}>
                    {mics && mics.length > 0 ? mics.map((item, index) => {
                        return (
                            item?.kind === "audioinput" && (
                                <StyledListItem key={`mics_${index}`} disablePadding>
                                    <Box
                                        sx={{
                                            width: "24px",
                                            mr: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {selectedMic?.label === item?.label && (
                                            <SelectedIcon style={{ height: "20px", width: "20px" }} />
                                        )}
                                    </Box>
                                    <ListItemButton
                                        onClick={() => {
                                            setSelectedMic((s) => ({
                                                ...s,
                                                label: item?.label,
                                                id: item?.deviceId,
                                            }));
                                            changeMic(item?.deviceId);
                                            if (
                                                mediaRecorder.current != null &&
                                                mediaRecorder.current.state === "recording"
                                            ) {
                                                stopRecording();
                                            }
                                            setRecordingProgress(0);
                                            setRecordingStatus("inactive");
                                        }}
                                        sx={{ py: 0.5, px: 0 }}
                                    >
                                        <ListItemText
                                            primary={
                                                item?.label ? item?.label : `Mic ${index + 1}`
                                            }
                                        />
                                    </ListItemButton>
                                </StyledListItem>
                            )
                        );
                    }) : <Box sx={{ p: 2 }}>No Mic Found</Box>}

                    <Divider sx={{ borderColor: "#F5F5F5", my: 1, mx: 2 }} />

                    {micOn ? (
                        <Box
                            sx={{
                                my: 1,
                                color: "#FFF",
                                display: "flex",
                                flexDirection: isMobile ? "column" : isLargeScreen ? "column" : "row",
                                width: "100%",
                                mb: 2,
                                pl: 1,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: isMobile || isLargeScreen || isSmallScreen ? "90%" : "60%",
                                    mr: isMobile ? 0 : isLargeScreen || isSmallScreen ? 2 : 0,
                                }}
                            >
                                <Box sx={{ mr: 0.5, mt: 0 }}>
                                    <TestMic />
                                </Box>

                                <Box
                                    sx={{
                                        width: isMobile ? "calc(100% - 40px)" : "144px",
                                        mt: 0,
                                        mr: isMobile ? 2.5 : 1,
                                        backgroundColor: "#6F767E",
                                        borderRadius: "9999px",
                                        height: "4px",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            backgroundColor: "#FFF",
                                            opacity: 0.5,
                                            height: "4px",
                                            borderRadius: "9999px",
                                            width: `${(volume / 256) * 100}%`,
                                        }}
                                    />
                                </Box>
                            </Box>

                            {!isMobile && (
                                <Box
                                    sx={{
                                        width: "33.333%",
                                        display: "flex",
                                        justifyContent: "center",
                                        mr: 1,
                                        mt: isLargeScreen || isSmallScreen ? 0.8 : 0,
                                    }}
                                >
                                    {recordingStatus === "inactive" && (
                                        <RecordButton onClick={startRecording} sx={{ mr: 1.5 }} >Record</RecordButton>
                                    )}

                                    {recordingStatus === "stopped recording" && (
                                        <RecordButton onClick={handlePlaying} sx={{ mr: 1.5 }}>Play</RecordButton>
                                    )}

                                    {recordingStatus === "recording" && (
                                        <ProgressButton isMobile={isMobile} onClick={stopRecording}>
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    height: "100%",
                                                    width: `${recordingProgress}%`,
                                                    backgroundColor: "#E53935",
                                                    borderRadius: "4px",
                                                    transition: "width 150ms linear",
                                                    pointerEvents: "none",
                                                }}
                                            />
                                            {/* PauseButton always centred on top */}
                                            <Box
                                                sx={{
                                                    position: "relative",
                                                    zIndex: 1,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                }}
                                            >
                                                <PauseButton />
                                                <Box
                                                    component="span"
                                                    sx={{ fontSize: "11px", color: "#FFF" }}
                                                >
                                                    {Math.ceil((recordingProgress / 100) * 5)}s
                                                </Box>
                                            </Box>
                                        </ProgressButton>
                                    )}

                                    {recordingStatus === "playing" && (
                                        <ProgressButton isMobile={isMobile} onClick={handlePlaying}>
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    height: "100%",
                                                    width: `${audioProgress}%`,
                                                    backgroundColor: "#4CAF50",
                                                    borderRadius: "4px",
                                                    transition: "width 200ms linear",
                                                    pointerEvents: "none",
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    position: "relative",
                                                    zIndex: 1,
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <PauseButton />
                                            </Box>
                                        </ProgressButton>
                                    )}
                                </Box>
                            )}

                            {(isMobile) && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        mt: 0.5,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "80%",
                                    }}
                                >
                                    {recordingStatus === "recording" && (
                                        <Typography
                                            sx={{
                                                fontSize: "12px",
                                                color: "#E5E5E5",
                                                textAlign: "center",
                                                mb: 1
                                            }}
                                        >
                                            Speak to test mic & speakers...
                                        </Typography>
                                    )}

                                    {recordingStatus === "inactive" && (
                                        <RecordButton onClick={startRecording} sx={{ mt: 0.5 }}>
                                            Test Mic and Speaker
                                        </RecordButton>
                                    )}

                                    {recordingStatus === "stopped recording" && (
                                        <RecordButton onClick={handlePlaying} sx={{ mt: 0.5 }}>
                                            Play
                                        </RecordButton>
                                    )}

                                    {recordingStatus === "recording" && (
                                        <ProgressButton isMobile={isMobile} onClick={stopRecording} sx={{ mt: 0.5 }}>
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    height: "100%",
                                                    width: `${recordingProgress}%`,
                                                    backgroundColor: "#E53935",
                                                    borderRadius: "4px",
                                                    transition: "width 100ms linear",
                                                    pointerEvents: "none",
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    position: "relative",
                                                    zIndex: 1,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                }}
                                            >
                                                <PauseButton />
                                                <Box
                                                    component="span"
                                                    sx={{ fontSize: "11px", color: "#FFF" }}
                                                >
                                                    {Math.ceil((recordingProgress / 100) * 5)}s
                                                </Box>
                                            </Box>
                                        </ProgressButton>
                                    )}

                                    {recordingStatus === "playing" && (
                                        <ProgressButton isMobile={isMobile} onClick={handlePlaying} sx={{ mt: 0.5 }}>
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    height: "100%",
                                                    width: `${audioProgress}%`,
                                                    backgroundColor: "#4CAF50",
                                                    borderRadius: "4px",
                                                    transition: "width 200ms linear",
                                                    pointerEvents: "none",
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    position: "relative",
                                                    zIndex: 1,
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <PauseButton />
                                            </Box>
                                        </ProgressButton>
                                    )}
                                </Box>
                            )}
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                color: "#747B84",
                                display: "flex",
                                alignItems: "center",
                                mb: 2,
                                pl: 2.5,
                            }}
                        >
                            <TestMicOff />
                            <Typography sx={{ ml: 1 }}>Unmute to test your mic</Typography>
                        </Box>
                    )}
                </List>
            </StyledPopover>

            <audio src={audio}></audio>
        </Box>
    );
}