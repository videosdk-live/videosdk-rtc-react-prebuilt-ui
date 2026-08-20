import { useCallback, useEffect, useRef, useState } from "react";
import { Box, IconButton, Popover, Typography, keyframes } from "@mui/material";
import { useTheme } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import { useMediaQuery } from "react-responsive";
import { runPreCallTest } from "@videosdk.live/react-sdk";
import NetworkIcon from "../icons/NetworkIcon";
import RefreshIcon from "../icons/PrecallTest/RefreshIcon";
import RefreshCheck from "../icons/PrecallTest/RefreshCheck";
import useIsMobile from "../utils/useIsMobile";
import useIsTab from "../utils/useIsTab";
import { appThemes, useMeetingAppContext } from "../MeetingAppContextDef";

const NETWORK_QUALITY_PANEL_WIDTH = 440;
const METRIC_LABEL_COL_WIDTH = 120;
const METRIC_DATA_COL_WIDTH = 80;

const formatMs = (v) => (v == null ? "-" : `${Math.round(v)} ms`);
const formatPercent = (v) => (v == null ? "-" : `${v.toFixed(2)}%`);
const formatKbps = (bps) =>
  bps == null ? "-" : `${Math.round(bps / 1000)} kb/s`;
const formatFps = (v) => (v == null ? "-" : `${Math.round(v)}`);

const overallQuality = (networkQuality) => {
  if (!networkQuality) return 0;
  const uplinkQuality = networkQuality.uplink?.quality ?? 0;
  const downlinkQuality = networkQuality.downlink?.quality ?? 0;
  if (!uplinkQuality && !downlinkQuality) return 0;
  if (!uplinkQuality) return downlinkQuality;
  if (!downlinkQuality) return uplinkQuality;
  return Math.min(uplinkQuality, downlinkQuality);
};

const QUALITY_BG = {
  5: "#3BA55D",
  4: "#7BC96F",
  3: "#faa713",
  2: "#FF8A4C",
  1: "#FF5D5D",
};
const QUALITY_LABEL = {
  5: "Excellent",
  4: "Good",
  3: "Fair",
  2: "Poor",
  1: "Bad",
};

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const cellBorder = (isLight) =>
  `1px solid ${isLight ? "#00000022" : "#ffffff33"}`;

const HeaderCell = ({ children, width, isLight, textColor }) => (
  <Box
    sx={{
      width,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderLeft: cellBorder(isLight),
    }}
  >
    <Typography
      sx={{
        fontSize: 12,
        color: textColor,
        my: "6px",
        textAlign: "center",
        fontWeight: 500,
      }}
    >
      {children}
    </Typography>
  </Box>
);

const DataCell = ({ children, width, isLight, textColor }) => (
  <Box
    sx={{
      width,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderLeft: cellBorder(isLight),
    }}
  >
    <Typography
      sx={{ fontSize: 12, color: textColor, my: "6px", textAlign: "center" }}
    >
      {children}
    </Typography>
  </Box>
);

const RunPrecallTest = ({
  videoStream,
  audioStream,
  token,
  appTheme: appThemeProp,
}) => {
  const isMobile = useIsMobile();
  const isTab = useIsTab();
  const isLGDesktop = useMediaQuery({ minWidth: 1024, maxWidth: 1439 });
  const isXLDesktop = useMediaQuery({ minWidth: 1440 });

  const theme = useTheme();
  const ctx = useMeetingAppContext();
  const appTheme = appThemeProp ?? ctx?.appTheme;
  const isLight = appTheme === appThemes.LIGHT;
  const panelBg = isLight
    ? theme.palette.lightTheme.main
    : theme.palette.darkTheme.eight;
  const textColor = isLight
    ? theme.palette.lightTheme.contrastText
    : theme.palette.common.white;
  const mutedTextColor = isLight
    ? theme.palette.lightTheme.four
    : theme.palette.darkTheme.four;
  const errorTextColor = "#FCA5A5";
  const iconHoverBg = isLight ? "#00000011" : "#ffffff33";

  const analyzerSize = isXLDesktop
    ? 32
    : isLGDesktop
      ? 28
      : isTab
        ? 24
        : isMobile
          ? 20
          : 18;

  const [status, setStatus] = useState("ready");
  const [networkQuality, setNetworkQuality] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const hasRunInitial = useRef(false);
  const inFlight = useRef(false);
  const finalReceivedRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    []
  );

  const runTest = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setStatus("running");
    setErrorMsg(null);
    setNetworkQuality(null);
    finalReceivedRef.current = false;
    try {
      if (!token) {
        if (mountedRef.current) {
          setErrorMsg("Missing token");
          setStatus("error");
        }
        return;
      }
      const result = await runPreCallTest({
        token,
        videoTrack: videoStream,
        audioTrack: audioStream,
        onStatsChange: (stats) => {
          if (finalReceivedRef.current || !mountedRef.current) return;
          setNetworkQuality(stats);
        },
      });
      if (mountedRef.current) {
        finalReceivedRef.current = true;
        setNetworkQuality(result.networkQuality);
        setStatus("ready");
      }
    } catch (err) {
      if (mountedRef.current) {
        setErrorMsg(err?.message || "Test failed");
        setStatus("error");
      }
    } finally {
      inFlight.current = false;
    }
  }, [videoStream, audioStream, token]);

  useEffect(() => {
    if (hasRunInitial.current) return;
    if (videoStream || audioStream) {
      hasRunInitial.current = true;
      runTest();
    }
  }, [videoStream, audioStream, runTest]);

  const overall = overallQuality(networkQuality);
  const overallBg = QUALITY_BG[overall] || "#3F4346";
  const overallLabel = QUALITY_LABEL[overall] || "—";

  const uplinkStats = networkQuality?.uplink;
  const downlinkStats = networkQuality?.downlink;

  const metricRows = [
    {
      label: "Latency",
      cells: [
        formatMs(uplinkStats?.video?.rtt),
        formatMs(uplinkStats?.audio?.rtt),
        formatMs(downlinkStats?.video?.rtt),
        formatMs(downlinkStats?.audio?.rtt),
      ],
    },
    {
      label: "Jitter",
      cells: [
        formatMs(uplinkStats?.video?.jitter),
        formatMs(uplinkStats?.audio?.jitter),
        formatMs(downlinkStats?.video?.jitter),
        formatMs(downlinkStats?.audio?.jitter),
      ],
    },
    {
      label: "Packet Loss",
      cells: [
        formatPercent(uplinkStats?.video?.packetLoss),
        formatPercent(uplinkStats?.audio?.packetLoss),
        formatPercent(downlinkStats?.video?.packetLoss),
        formatPercent(downlinkStats?.audio?.packetLoss),
      ],
    },
    {
      label: "Bitrate",
      cells: [
        formatKbps(uplinkStats?.video?.bitrate),
        formatKbps(uplinkStats?.audio?.bitrate),
        formatKbps(downlinkStats?.video?.bitrate),
        formatKbps(downlinkStats?.audio?.bitrate),
      ],
    },
    {
      label: "Frame rate",
      cells: [
        formatFps(uplinkStats?.video?.fps),
        "-",
        formatFps(downlinkStats?.video?.fps),
        "-",
      ],
    },
    {
      label: "Resolution",
      cells: [
        uplinkStats?.video?.resolution ?? "-",
        "-",
        downlinkStats?.video?.resolution ?? "-",
        "-",
      ],
    },
  ];

  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);
  const panelWidth = Math.min(
    NETWORK_QUALITY_PANEL_WIDTH,
    typeof window !== "undefined"
      ? window.innerWidth - 16
      : NETWORK_QUALITY_PANEL_WIDTH
  );

  return (
    <Box
      onClick={(e) => e.stopPropagation()}
      sx={{ borderRadius: "6px", cursor: "pointer" }}
    >
      <Box
        component="button"
        aria-label={`Network quality: ${overallLabel}`}
        onClick={(e) => {
          e.stopPropagation();
          setAnchorEl(anchorEl ? null : e.currentTarget);
        }}
        sx={{
          border: "none",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: "6px",
          cursor: "pointer",
          backgroundColor: overallBg,
        }}
      >
        <NetworkIcon
          color1="#ffffff"
          color2="#ffffff"
          color3="#ffffff"
          color4="#ffffff"
          style={{
            height: analyzerSize * 0.6,
            width: analyzerSize * 0.6,
          }}
        />
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            backgroundColor: panelBg,
            borderRadius: "8px",
            width: panelWidth,
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            p: "9px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: overallBg,
          }}
        >
          <Typography
            sx={{ fontSize: 14, color: theme.palette.common.white, fontWeight: 600 }}
          >{`Quality Score : ${overallLabel}`}</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                runTest();
              }}
              disabled={status === "running"}
              size="small"
              title="Re-run test"
              sx={{
                color: theme.palette.common.white,
                opacity: status === "running" ? 0.5 : 1,
                "&:hover": { backgroundColor: "#ffffff33" },
                "&.Mui-disabled": { color: theme.palette.common.white },
                animation:
                  status === "running" ? `${spin} 1s linear infinite` : "none",
              }}
            >
              {status === "running" ? <RefreshCheck /> : <RefreshIcon />}
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              sx={{
                color: theme.palette.common.white,
                "&:hover": { backgroundColor: "#ffffff33" },
              }}
            >
              <CloseIcon sx={{ height: 16, width: 16 }} />
            </IconButton>
          </Box>
        </Box>

        {status === "running" && !networkQuality && (
          <Box sx={{ px: "12px", py: "12px" }}>
            <Typography sx={{ fontSize: 12, color: mutedTextColor }}>
              Running pre-call test…
            </Typography>
          </Box>
        )}

        {status === "error" && (
          <Box sx={{ px: "12px", py: "12px" }}>
            <Typography sx={{ fontSize: 12, color: errorTextColor }}>
              {errorMsg || "Test failed."} Tap refresh to retry.
            </Typography>
          </Box>
        )}

        {networkQuality && status !== "error" && (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", borderBottom: cellBorder(isLight) }}>
              <Box sx={{ width: METRIC_LABEL_COL_WIDTH }} />
              <HeaderCell
                width={METRIC_DATA_COL_WIDTH * 2}
                isLight={isLight}
                textColor={textColor}
              >
                Uplink
              </HeaderCell>
              <HeaderCell
                width={METRIC_DATA_COL_WIDTH * 2}
                isLight={isLight}
                textColor={textColor}
              >
                Downlink
              </HeaderCell>
            </Box>

            <Box sx={{ display: "flex", borderBottom: cellBorder(isLight) }}>
              <Box sx={{ width: METRIC_LABEL_COL_WIDTH }} />
              {["Video", "Audio", "Video", "Audio"].map((h, i) => (
                <DataCell
                  key={i}
                  width={METRIC_DATA_COL_WIDTH}
                  isLight={isLight}
                  textColor={textColor}
                >
                  {h}
                </DataCell>
              ))}
            </Box>

            {metricRows.map((item, index) => (
              <Box
                key={item.label}
                sx={{
                  display: "flex",
                  borderBottom:
                    index === metricRows.length - 1
                      ? "none"
                      : cellBorder(isLight),
                }}
              >
                <Box
                  sx={{
                    width: METRIC_LABEL_COL_WIDTH,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{ fontSize: 12, color: textColor, my: "6px", ml: 2 }}
                  >
                    {item.label}
                  </Typography>
                </Box>
                {item.cells.map((cellVal, cIdx) => (
                  <DataCell
                    key={cIdx}
                    width={METRIC_DATA_COL_WIDTH}
                    isLight={isLight}
                    textColor={textColor}
                  >
                    {cellVal}
                  </DataCell>
                ))}
              </Box>
            ))}
          </Box>
        )}
      </Popover>
    </Box>
  );
};

export default RunPrecallTest;
