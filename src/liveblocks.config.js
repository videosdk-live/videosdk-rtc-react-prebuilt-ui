import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const location = window.location;

const urlParams = new URLSearchParams(location.search);

const name = urlParams.get("name");
// const name = localStorage.getItem("name");

const client = createClient({
  authEndpoint: async (room) => {
    const response = await fetch("http://localhost:4545/api/auth", {
      method: "POST",
      headers: {
        Authentication:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJhZWE5NzM1My1iOTI2LTQ2ZjEtYWI1Yy03YTljNzNmNDZhZGMiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY2MDgxMDE3MywiZXhwIjoxNjYwODk2NTczfQ.VNAxmZe9I2hXjVy1MV8hmPYxEaJs3dexqPW6lBTNSaQ",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ room, name: name }),
    });
    return await response.json();
  },
});

export const {
  RoomProvider,
  useOthers,
  useUpdateMyPresence,
  useMyPresence,
  useObject,
} = createRoomContext(client);
