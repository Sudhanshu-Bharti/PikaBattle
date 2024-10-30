"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSocket, useRoom } from "../../Context/SocketContext";
import PokemonStats from "../../../components/pokemon-stats/PokemonStats";
import PokemonSprite from "../../../components/poke-sprite/pokemonSprite";
import BattleControls from "../../../components/controls/Control";
import WaitingScreen from "../../../components/waiting-screen/WaitingScreen";
import Battlelog from "../../../components/battlelog/Battlelog";
import PokemonParty from "../../../components/pokemon-party/party";
import { generateDeckUrl, generateOpponentDeckUrl } from "./../../../utils/image.utils";
import { motion } from "framer-motion";

const Page = () => {
  const { socket } = useSocket();
  let { room, setRoom } = useRoom();
  const [storedUserId, setStoredUserId] = useState(null);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [waiting, setWaiting] = useState(false);
  const [deckData, setDeckData] = useState(null);
  const [opponentDeck, setOpponentDeck] = useState([]);
  const [selectedAttack, setSelectedAttack] = useState(null);
  const [currentPokemonIndex, setCurrentPokemonIndex] = useState(0);
  const [battleLog, setBattleLog] = useState([]);
  const [party, setParty] = useState([]); 

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

  // const handleAttack = async () => {
  //   console.log("Attack by user");
  //   setPlayerTurn(false);
  //   setWaiting(true);
  //   socket.emit("turn-change", "change turn please");

  //   try {
  //     const attackDamage = deckData?.data.deck[0]?.attacks[0]?.damage;
  //     console.log("Attack Damage: ", attackDamage);
  //   } catch (error) {
  //     console.error("Error fetching attack data:", error);
  //   }
  // };

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
      setParty(deckData?.data?.deck || []);
      console.log("Party data: ", party);
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
  const handleAttack = async (attack) => {
    setPlayerTurn(false);
    setWaiting(true);
    socket.emit("turn-change", "change turn please");
    setBattleLog((prev) => [
      ...prev,
      `${deckData?.data?.deck?.[currentPokemonIndex]?.name} used ${attack.name}!`,
    ]);
  };

  const handleSwitchPokemon = (index) => {
    setCurrentPokemonIndex(index);
    setBattleLog((prev) => [...prev, `Switched to ${party[index]?.name}`]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-600">
      <div className="relative w-full h-[32rem] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center">
          <div className="flex justify-center gap-[1090px] items-center h-full px-12">
            {deckData?.data?.deck?.[currentPokemonIndex] ? (
              <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="relative">
                <PokemonStats
                  name={deckData.data.deck[currentPokemonIndex].name}
                  hp={deckData.data.deck[currentPokemonIndex].hp}
                />
                <PokemonSprite
                  name={deckData.data.deck[currentPokemonIndex].name}
                  imageUrl={generateDeckUrl(deckData)}
                />
              </motion.div>
            ) : (
              <p>Loading your Pokémon...</p>
            )}

            {opponentDeck?.[0] ? (
              <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="relative">
                <PokemonStats name={opponentDeck[0].name} hp={opponentDeck[0].hp} />
                <PokemonSprite
                  name={opponentDeck[0].name}
                  imageUrl={generateOpponentDeckUrl(opponentDeck)}
                  isOpponent
                />
              </motion.div>
            ) : (
              <p>Waiting for opponent...</p>
            )}
          </div>
        </div>
      </div>

      <div className="relative bg-gray-900/90 p-6 rounded-t-3xl -mt-8">
        {waiting ? (
          <WaitingScreen />
        ) : (
          <BattleControls
            pokemon={deckData?.data?.deck?.[currentPokemonIndex]}
            playerTurn={playerTurn}
            onAttack={handleAttack}
          />
        )}
        
        <div className="mt-2">
          <PokemonParty
            party={party}
            onSwitchPokemon={handleSwitchPokemon}
            currentPokemon={currentPokemonIndex}
          />
        </div>
        
        <Battlelog logs={battleLog} />
      </div>
    </div>
  );
};

export default Page;
