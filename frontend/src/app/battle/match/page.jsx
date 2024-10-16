"use client";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import axios from "axios";
import { useSocket, useRoom } from "../../Context/SocketContext";

const Page = () => {
  const { socket } = useSocket();
  let { room, setRoom } = useRoom();
  // const storedUserId = localStorage.getItem('userId');
  const [storedUserId, setStoredUserId] = useState(null);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [waiting, setWaiting] = useState(false);
  const [deckData, setDeckData] = useState(null);
  const [opponentDeck, setOpponentDeck] = useState([]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    const beforeUnloadHandler = (event) => {
      handleBeforeUnload(event);
    };

    window.addEventListener("beforeunload", beforeUnloadHandler);

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('userId');
      setStoredUserId(userId);
    }
  }, []);

  const handleAttack = async () => {
    console.log("Attack by user");
    setPlayerTurn(false);
    setWaiting(true);
    socket.emit("turn-change", "change turn please");

    try {
      const attackDamage = deckData?.data.deck[0]?.attacks[0]?.damage;
      console.log("Attack Damage: ", attackDamage);
    } catch (error) {
      console.error("Error fetching attack data:", error);
    }
  };

  useEffect(() => {
    if (socket&&storedUserId) {
      socket.emit('addUser',{playerId:storedUserId,username:'soham'});
      socket.on("playerTurn", (data) => {
        setPlayerTurn(true);
        setWaiting(false);
      });

      socket.on("opponent-deck", (res) => {
        if (res?.deckData?.data?.deck?.length > 0) {
          setOpponentDeck(res.deckData.data.deck);
          console.log("Opponent deck: ", res.deckData.data.deck);
        } else {
          console.log("Received invalid deck data:", res.deckData);
        }
      });

      socket.on("demand-deck", async() => {
        try {
          const playerId = localStorage.getItem("userId");
          console.log(playerId);
          const response = await axios.post("http://localhost:4000/get-pokemon-info", {
            playerId,
          });
          console.log(response.data);
          const deck=response.data;
          socket.emit("opponent-deck", { message: "opponentDeck", room, deck });
          setDeckData(response.data);
        } catch (error) {
          console.error("Error fetching deck data:", error);
        }
        
      });

      return () => {
        socket.off("playerTurn");
        socket.off("opponent-deck");
        socket.off("demand-deck");
      };
    }
  }, [socket,storedUserId]);

  useEffect(() => {
    if (socket && deckData) {
      if (room) {
        socket.emit("opponent-deck", { message: "opponentDeck", room, deckData });
      } else {
        room = sessionStorage.getItem("room");
        socket.emit("opponent-deck", { message: "opponentDeck", room, deckData });
      }
    }
  }, [socket, deckData, room]);

  useEffect(() => {
    if (!opponentDeck?.[0]?.imgUrl && socket) {
      console.log("Demanding deck");
      socket.emit("demand-deck", "deck is needed");
    }
  }, [opponentDeck, socket]);
  const fetchDeckData = async () => {
    try {
      const playerId = localStorage.getItem("userId");
      console.log(playerId);
      const response = await axios.post("http://localhost:4000/get-pokemon-info", {
        playerId,
      });
      console.log(response.data);
      setDeckData(response.data);
    } catch (error) {
      console.error("Error fetching deck data:", error);
    }
  };


  useEffect(() => {
    // const fetchDeckData = async () => {
    //   try {
    //     const playerId = localStorage.getItem("userId");
    //     console.log(playerId);
    //     const response = await axios.post("http://localhost:4000/get-pokemon-info", {
    //       playerId,
    //     });
    //     console.log(response.data);
    //     setDeckData(response.data);
    //   } catch (error) {
    //     console.error("Error fetching deck data:", error);
    //   }
    // };

    fetchDeckData();
  }, []);

  const generateDeckUrl = (deckData) => {
    const url = deckData?.data?.deck?.[0]?.imgUrl;
    let newUrl = null;

    if (url) {
      const lastIndex = url.lastIndexOf("/");
      const index = url.substring(lastIndex + 1, url.lastIndexOf("."));
      newUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/${index}.gif`;
    } else {
      console.error("imgUrl not fetched");
    }

    return newUrl;
  };

  const generateOpponentDeckUrl = (opponentDeck) => {
    const opponentUrl = opponentDeck?.[0]?.imgUrl;
    let newUrl = null;

    if (opponentUrl) {
      const lastIndex = opponentUrl.lastIndexOf("/");
      const index = opponentUrl.substring(lastIndex + 1, opponentUrl.lastIndexOf("."));
      newUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${index}.gif`;
    } else {
      console.error("Opponent imgUrl not fetched");
      if (socket) {
        socket.emit("demand-deck", "deck is needed");
      }
    }

    return newUrl;
  };

  const opponentDeckUrl = generateOpponentDeckUrl(opponentDeck);
  console.log(opponentDeckUrl);
  const mainDeckUrl = generateDeckUrl(deckData);

  return (
    <div className="grid items-center justify-center w-full gap-1" id="battle">
      <div
        className="relative w-lvw h-96"
        style={{
          backgroundImage: "url('/battleBackground2.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          objectFit: "fill",
        }}
      >
        <div className="flex justify-around items-center">
          <div className="grid items-center justify-center w-full gap-4 right-full">
            <div className="grid items-center justify-center gap-2 pr-80 pt-64">
              <div className="flex items-center gap-2">
                <img
                  alt={deckData?.data?.deck?.[0]?.name}
                  height="96"
                  src={mainDeckUrl}
                  style={{
                    aspectRatio: "120/120",
                    objectFit: "cover",
                  }}
                  width="96"
                />
                <div className="grid items-center gap-1">
                  <h3 className="text-lg font-bold">{deckData?.data?.deck?.[0]?.name}</h3>
                  <div className="flex rounded-full border border-gray-200 w-full h-2">
                    <div className="rounded-full bg-green-500 w-1/2 h-2" />
                  </div>
                  <p className="text-sm font-medium">{`HP: ${deckData?.data?.deck?.[0]?.hp}`}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid items-center justify-center w-full gap-4">
            <div className="grid items-center justify-center gap-2 pl-80 pb-56">
              <div className="flex items-center gap-2">
                {opponentDeck?.[0] && (
                  <img
                    alt={opponentDeck[0].name}
                    height="96"
                    src={opponentDeckUrl}
                    style={{
                      aspectRatio: "120/120",
                      objectFit: "cover",
                    }}
                    width="96"
                  />
                )}
                <div className="grid items-center gap-1">
                  <h3 className="text-lg font-bold">{opponentDeck?.[0]?.name}</h3>
                  <div className="flex rounded-full border border-gray-200 w-full h-2">
                    <div className="rounded-full bg-green-500 w-1/2 h-2" />
                  </div>
                  <p className="text-sm font-medium">{`HP: ${opponentDeck?.[0]?.hp}`}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row-2">
        {waiting ? (
          <div className="bottom-44 left-0 w-full h-28 bg-white bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-lg font-semibold">Wait for your turn...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1 w-auto border-2 rounded-md m-2 p-2 border-orange-100">
              <h1 className="font-semibold text-xl">Attacks</h1>
              <div className="grid grid-cols-4 gap-2">
                {deckData?.data?.deck?.[0]?.attacks?.map((attack, index) => (
                  <button key={index} className="border-amber-400" onClick={playerTurn ? handleAttack : undefined}>
                    {attack.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1 w-auto border-2 rounded-md m-2 p-2 border-orange-100">
            <h1 className="font-semibold text-xl">Abilities</h1>
              <div className="grid grid-cols-4 gap-2">
                {deckData?.data?.deck?.[0]?.abilities?.map((ability, index) => (
                  <button key={index} className="border-amber-400" onClick={playerTurn ? handleAttack : undefined}>
                    {ability.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;

