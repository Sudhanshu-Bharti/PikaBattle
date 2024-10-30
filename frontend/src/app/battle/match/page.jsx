"use client"
import React, { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import axios from "axios";
import { useSocket, useRoom } from "../../Context/SocketContext";
import { motion, AnimatePresence } from "framer-motion";
import PokemonParty from "../../../components/pokemon-party/party";

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

  const handleAttack = async (attack) => {
    setSelectedAttack(attack);
    console.log("Attack by user");
    setPlayerTurn(false);
    setWaiting(true);
    socket.emit("turn-change", "change turn please");

    setBattleLog(prev => [...prev, `${deckData?.data?.deck?.[0]?.name} used ${attack.name}!`]);

    try {
      const attackDamage = attack.damage;
      console.log("Attack Damage: ", attackDamage);
    } catch (error) {
      console.error("Error fetching attack data:", error);
    }
  };

  const handleSwitchPokemon = (index) => {
    setCurrentPokemonIndex(index);
    setBattleLog((prev) => [...prev, `Switched to ${party[index]?.name}`]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-600">
      <div className="relative w-full h-[32rem] overflow-hidden">
        
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/pokemon-stadium.jpg')",
            filter: "contrast(1.1) brightness(1.1)",
          }}
        >

          <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-red-400 rounded-full filter blur-3xl opacity-20 animate-pulse" />
          
          <div className="flex justify-between items-center h-full px-12">
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="relative"
            >
              <div className="absolute -top-16 left-0 bg-black/60 text-white px-4 py-2 rounded-lg">
                <h3 className="text-lg font-bold">{deckData?.data?.deck?.[0]?.name}</h3>
                <div className="w-48">
                  <div className="h-2 bg-gray-700 rounded-full">
                    <div className="h-2 bg-gradient-to-r from-green-500 to-green-400 rounded-full w-1/2 transition-all duration-500" />
                  </div>
                  <p className="text-sm mt-1">HP: {deckData?.data?.deck?.[0]?.hp}</p>
                </div>
              </div>
              <motion.img
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                alt={deckData?.data?.deck?.[0]?.name}
                src={generateDeckUrl(deckData)}
                className="w-48 h-48 object-contain filter drop-shadow-lg"
              />
            </motion.div>

            {/* Opponent Pokemon */}
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="relative"
            >
              <div className="absolute -top-16 right-0 bg-black/60 text-white px-4 py-2 rounded-lg">
                <h3 className="text-lg font-bold">{opponentDeck?.[0]?.name}</h3>
                <div className="w-48">
                  <div className="h-2 bg-gray-700 rounded-full">
                    <div className="h-2 bg-gradient-to-r from-green-500 to-green-400 rounded-full w-1/2 transition-all duration-500" />
                  </div>
                  <p className="text-sm mt-1">HP: {opponentDeck?.[0]?.hp}</p>
                </div>
              </div>
              {opponentDeck?.[0] && (
                <motion.img
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  alt={opponentDeck[0].name}
                  src={generateOpponentDeckUrl(opponentDeck)}
                  className="w-48 h-48 object-contain filter drop-shadow-lg"
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="relative bg-gray-900/90 p-6 rounded-t-3xl -mt-8">
        {waiting ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-8 bg-white/10 rounded-xl backdrop-blur-sm"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
            </div>
            <p className="text-white text-lg font-semibold mt-4">Waiting for opponent's move...</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-800/50 p-4 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-4">Attacks</h2>
              <div className="grid grid-cols-2 gap-3">
                {deckData?.data?.deck?.[0]?.attacks?.map((attack, index) => (
                  <Button
                    key={index}
                    onClick={() => playerTurn && handleAttack(attack)}
                    className={`
                      relative overflow-hidden bg-slate-700 text-white font-medium py-2 px-4 
                      rounded-lg transform transition-all hover:scale-105 
                      ${!playerTurn && 'opacity-50 cursor-not-allowed'}
                    `}
                  >
                    {attack.name}
                    {attack.damage && (
                      <span className="absolute top-0 right-0 bg-yellow-700 text-xs px-1 rounded-bl-lg">
                        {attack.damage}
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-4">Abilities</h2>
              <div className="grid grid-cols-2 gap-3">
                {deckData?.data?.deck?.[0]?.abilities?.map((ability, index) => (
                  <Button
                    key={index}
                    onClick={() => playerTurn && handleAttack(ability)}
                    className={`
                      bg-gradient-to-r from-blue-500 to-purple-500 
                      hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2 px-4 
                      rounded-lg transform transition-all hover:scale-105
                      ${!playerTurn && 'opacity-50 cursor-not-allowed'}
                    `}
                  >
                    {ability.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
          <div className="mt-2" >
          <PokemonParty
              party={party}
              onSwitchPokemon={handleSwitchPokemon}
              currentPokemon={currentPokemonIndex}
            />
          </div>
        <div className="mt-4 bg-black/30 rounded-lg p-3 max-h-32 overflow-y-auto">

          <AnimatePresence>
            {battleLog.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-white text-sm mb-1"
              >
                {log}
              </motion.div>
            ))}
            
          </AnimatePresence>

        </div>
      </div>
     
    </div>
  );
};

export default Page;