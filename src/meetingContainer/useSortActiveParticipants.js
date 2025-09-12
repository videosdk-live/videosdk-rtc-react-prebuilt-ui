import { Constants, useMeeting } from "@videosdk.live/react-sdk";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMeetingAppContext } from "../MeetingAppContextDef";
import useIsMobile from "../utils/useIsMobile";
import useIsTab from "../utils/useIsTab";
import {
  maxParticipantGridCount_large_desktop,
  maxParticipantGridCount_desktop,
  maxParticipantGridCount_mobile,
  maxParticipantGridCount_tab,
} from "../utils/common";
import useIsLGDesktop from "../utils/useIsLGDesktop";
import useIsSMDesktop from "../utils/useIsSMDesktop";

const useSortActiveParticipants = () => {
  const [presenterId, setPresenterId] = useState();

  const participantsRef = useRef();
  const activeSortedParticipantsRef = useRef();
  const maxParticipantInMainViewRef = useRef();
  const mainViewParticipantsRef = useRef();
  const localParticipantIdRef = useRef();

  const isLGDesktop = useIsLGDesktop();
  const isSMDesktop = useIsSMDesktop();
  const isTab = useIsTab();
  const isMobile = useIsMobile();

  const {
    activeSortedParticipants,
    mainViewParticipants,
    setActiveSortedParticipants,
    setMainViewParticipants,
    whiteboardStarted,
    layoutGridSize,
    hideLocalParticipant,
  } = useMeetingAppContext();

  const sortActiveParticipants = (activeParticipants) => {
    activeParticipants.sort((a, b) => {
      if (a.lastActiveOn > b.lastActiveOn) {
        return -1;
      }
      if (a.lastActiveOn < b.lastActiveOn) {
        return 1;
      }
      return 0;
    });
    return activeParticipants;
  };

  const _handleOnSpeakerChanged = (activeSpeakerId) => {
    if (
      activeSpeakerId &&
      (hideLocalParticipant
        ? activeSpeakerId !== localParticipantIdRef.current
        : true)
    ) {
      const mainViewParticipants = mainViewParticipantsRef.current;
      const activeParticipants = activeSortedParticipantsRef.current;
      const lastActiveOn = new Date().getTime();

      const foundIndex = activeParticipants.findIndex(
        ({ participantId }) => activeSpeakerId === participantId
      );

      const foundIndexMain = mainViewParticipants.findIndex(
        (participantId) => activeSpeakerId === participantId
      );

      const newParticipantObj = {
        participantId: activeSpeakerId,
        lastActiveOn,
      };

      let activeSortedParticipants;

      if (foundIndex !== -1) {
        activeParticipants[foundIndex] = newParticipantObj;

        activeSortedParticipants = sortActiveParticipants(activeParticipants);
      } else {
        activeParticipants.unshift(newParticipantObj);
        activeSortedParticipants = sortActiveParticipants(activeParticipants);
      }

      if (foundIndexMain === -1) {
        // if not space in main then get inactive from active and replace with active into main
        const mainParticipantsLastActive = activeSortedParticipants.filter(
          ({ participantId }) =>
            mainViewParticipants.findIndex((pID) => pID === participantId) !==
            -1
        );

        const notActive =
          mainParticipantsLastActive[mainParticipantsLastActive.length - 1];

        const notActiveMainIndex = mainViewParticipants.findIndex(
          (participantId) => notActive.participantId === participantId
        );

        mainViewParticipants[notActiveMainIndex] = activeSpeakerId;

        setMainViewParticipants(mainViewParticipants);
      }

      setActiveSortedParticipants(activeSortedParticipants);
    }
  };

  const _handleOnParticipantJoined = (participant) => {
    const participantId = participant.id;

    // filter out viewer mode participant
    if (participant.mode == Constants.modes.SIGNALLING_ONLY) {
      return;
    }

    const activeParticipants = activeSortedParticipantsRef.current;
    const mainViewParticipants = mainViewParticipantsRef.current;
    const maxParticipantInMainView = maxParticipantInMainViewRef.current;

    const lastActiveOn = new Date().getTime();

    const foundIndex = activeParticipants.findIndex(
      ({ participantId: pID }) => {
        return pID === participantId;
      }
    );

    const filteredMainViewParticipants = [...mainViewParticipants].filter(
      (pID) => pID !== participantId
    );

    if (foundIndex === -1) {
      activeParticipants.push({ participantId, lastActiveOn });
    } else {
      activeParticipants[foundIndex] = { participantId, lastActiveOn };
    }

    const activeSortedParticipants = sortActiveParticipants(activeParticipants);

    setActiveSortedParticipants(activeSortedParticipants);

    if (filteredMainViewParticipants.length < maxParticipantInMainView) {
      filteredMainViewParticipants.unshift(participantId);
      setMainViewParticipants(filteredMainViewParticipants);
    } else {
    }
  };

  const _handleOnParticipantLeft = (participant) => {
    const participantId = participant.id;

    const mainViewParticipants = mainViewParticipantsRef.current;
    const activeSortedParticipants = activeSortedParticipantsRef.current;

    const filteredActiveParticipants = activeSortedParticipants.filter(
      ({ participantId: pId }) => participantId !== pId
    );

    const index = mainViewParticipants.findIndex(
      (pID) => pID === participantId
    );

    if (index !== -1) {
      const filteredMainViewParticipants = mainViewParticipants.filter(
        (pID) => pID !== participantId
      );

      const inQueue = filteredActiveParticipants.filter(
        ({ participantId }) =>
          filteredMainViewParticipants.findIndex(
            (pID) => pID === participantId
          ) === -1
      );

      if (inQueue.length) {
        filteredMainViewParticipants.unshift(inQueue[0].participantId);
      }

      setMainViewParticipants(filteredMainViewParticipants);
    } else {
    }

    const sortedActive = sortActiveParticipants(filteredActiveParticipants);

    setActiveSortedParticipants(sortedActive);
  };

  const _sortOnModify = ({ maxParticipantInMainView: maxCount } = {}) => {
    const activeSortedParticipants = activeSortedParticipantsRef.current;

    const maxParticipantInMainView =
      maxCount || maxParticipantInMainViewRef.current;

    const slicedParticipantIds = activeSortedParticipants
      .slice(0, maxParticipantInMainView)
      .map(({ participantId }) => participantId);

    setMainViewParticipants(slicedParticipantIds);
  };

  const _sortOnInit = () => {
    const participants = participantsRef.current;
    const maxParticipantInMainView = maxParticipantInMainViewRef.current;
    const conferenceParticipantsArray = [...participants.values()].filter(
      (participant) => participant.mode === Constants.modes.SEND_AND_RECV
    );

    const conferenceParticipantsMap = new Map(
      conferenceParticipantsArray.map((participant) => [
        participant.id,
        participant,
      ])
    );

    const participantIds = [...conferenceParticipantsMap.keys()];

    const activeParticipants = [];

    participantIds.forEach((participantId) => {
      const lastActiveOn = new Date().getTime();

      activeParticipants.push({ participantId, lastActiveOn });
    });

    let activeSortedParticipants = sortActiveParticipants(activeParticipants);

    let slicedParticipantIds = activeSortedParticipants
      .slice(0, maxParticipantInMainView)
      .map(({ participantId }) => participantId);

    if (hideLocalParticipant) {
      activeSortedParticipants = activeSortedParticipants.filter(
        ({ participantId }) => participantId !== localParticipantIdRef.current
      );

      slicedParticipantIds = slicedParticipantIds.filter(
        (participantId) => participantId !== localParticipantIdRef.current
      );
    }

    setActiveSortedParticipants(activeSortedParticipants);
    setMainViewParticipants(slicedParticipantIds);
  };

  const mMeeting = useMeeting({
    onSpeakerChanged: _handleOnSpeakerChanged,
    onParticipantJoined: _handleOnParticipantJoined,
    onParticipantLeft: _handleOnParticipantLeft,
    onMeetingJoined: _sortOnInit,
  });

  const participants = mMeeting?.participants;

  const conferenceParticipantsArray = [...participants.values()].filter(
    (participant) => participant.mode === Constants.modes.SEND_AND_RECV
  );

  const conferenceParticipantsMap = new Map(
    conferenceParticipantsArray.map((participant) => [
      participant.id,
      participant,
    ])
  );

  const mPresenterId = mMeeting?.presenterId;
  const localParticipantId = mMeeting?.localParticipant?.id;

  const maxParticipantInMainView = useMemo(() => {
    let n =
      presenterId || whiteboardStarted
        ? isLGDesktop
          ? 4
          : 3
        : isLGDesktop
        ? maxParticipantGridCount_large_desktop
        : isSMDesktop
        ? maxParticipantGridCount_desktop
        : isTab
        ? maxParticipantGridCount_tab
        : isMobile
        ? maxParticipantGridCount_mobile
        : 0;

    if (typeof layoutGridSize === "number" && n > layoutGridSize) {
      n = layoutGridSize;
    }

    return n;
  }, [
    isLGDesktop,
    isSMDesktop,
    isTab,
    isMobile,
    presenterId,
    whiteboardStarted,
    layoutGridSize,
  ]);

  useEffect(() => {
    setPresenterId(mPresenterId);
  }, [mPresenterId]);

  useEffect(() => {
    activeSortedParticipantsRef.current = [...activeSortedParticipants];
  }, [activeSortedParticipants]);

  useEffect(() => {
    mainViewParticipantsRef.current = [...mainViewParticipants];
  }, [mainViewParticipants]);

  useEffect(() => {
    maxParticipantInMainViewRef.current = maxParticipantInMainView;
    _sortOnModify({ maxParticipantInMainView });
  }, [maxParticipantInMainView]);

  useEffect(() => {
    participantsRef.current = conferenceParticipantsMap;
  }, [conferenceParticipantsMap]);

  useEffect(() => {
    localParticipantIdRef.current = localParticipantId;
  }, [localParticipantId]);
};

export default useSortActiveParticipants;
