import { useMeeting } from "@videosdk.live/react-sdk";
import React, { useState } from "react";
import ConfirmBox from "./ConfirmBox";

const RequestedEntries = () => {
  const [requestedEntries, setRequestedEntries] = useState([]);

  const handleOnEntryRequested = ({ participantId, name, allow, deny }) => {
    setRequestedEntries((s) => [...s, { participantId, name, allow, deny }]);
  };

  const handleOnEntryResponded = (participantId, decision) => {
    setRequestedEntries((s) =>
      s.filter((p) => p.participantId !== participantId)
    );
  };

  useMeeting({
    onEntryRequested: handleOnEntryRequested,
    onEntryResponded: handleOnEntryResponded,
  });

  return requestedEntries.map(({ participantId, name, allow, deny }) => {
    return (
      <ConfirmBox
        key={`entry_request_${participantId}`}
        {...{
          successText: "Allow",
          rejectText: "Deny",
          open: true,
          onReject: deny,
          onSuccess: allow,
          title: `${name} wants to join`,
          subTitle: `Click allow button to let the participant join the meeting.`,
        }}
      />
    );
  });
};

export default RequestedEntries;
