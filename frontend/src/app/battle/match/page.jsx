"use client"
import {React, useEffect, useState} from 'react';
import { Button } from '../../../components/ui/button';
import axios from "axios" 
import { useSocket,useRoom } from '../../Context/SocketContext';
import { io } from 'socket.io-client';
const Page = () => {

  // const socket = io('http://localhost:4000'); 
  const {socket}=useSocket();
  let { room,setRoom} = useRoom();

  const [playerTurn, setPlayerTurn] = useState(true); 
  const [waiting, setWaiting] = useState(false); 
  const [deckData, setDeckData] = useState(null);
  const[opponentDeck,setOpponentDeck]=useState({});

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };

    const beforeUnloadHandler = (event) => {
      handleBeforeUnload(event);
    };

    window.addEventListener('beforeunload', beforeUnloadHandler);

    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);
    
  const handleAttack = async () => {
      console.log("attack by user");
      setPlayerTurn(false);
      setWaiting(true)
      socket.emit('turn-change','change turn please');

      try {
        const attackDamage = deckData.data.deck[0].attacks[0].damage; 
        console.log("Attack Damage: ", attackDamage);
      
      } catch (error) {
        console.error('Error fetching attack data:', error);
      }
  };

  useEffect(() => {
    if(socket)
    {
      socket.on('playerTurn', (data) => {
      setPlayerTurn(true);
      setWaiting(false);
    });

    socket.on('opponent-deck', (res) => {
      if (res && res.deckData && res.deckData.data && Array.isArray(res.deckData.data.deck) && res.deckData.data.deck.length > 0) {
        setOpponentDeck(res.deckData.data.deck);
        console.log("opponent deck: ", res.deckData.data.deck); 
      } else {
        console.log("Received invalid deck data:", res.deckData);
      }
    });
    socket.on('demand-deck',()=>{
      socket.emit('opponent-deck', {message:'opponentDeck',room,deckData});
    })
    
    
  
    return () => {
      socket.off('playerTurnChange');
    }
  }
  }, [socket]);

  
  useEffect(()=>{
    if(socket){
      if(room){
        socket.emit('opponent-deck', {message:'opponentDeck',room,deckData});
      }else{
        room=sessionStorage.getItem('room');
        socket.emit('opponent-deck', {message:'opponentDeck',room,deckData});
      }
      
    }
    // console.log("opp deck",);
  },[socket,deckData,room]);

  useEffect(()=>{
    const opponentUrl = opponentDeck &&  opponentDeck?.length > 0 && opponentDeck[0]?.imgUrl;
    if(!opponentUrl){
      if(socket){
      console.log('demanding deck');
      socket.emit('demand-deck','deck is needed')
    }
    }
  },[opponentDeck,socket])
    


  useEffect(() => {
    const fetchDeckData = async () => {
      try {
        const playerId = localStorage.getItem('userId'); 
        console.log(playerId);
        const response = await axios.post('http://localhost:4000/get-pokemon-info', {
          playerId
        });

        // "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/25.gif"
        console.log(response.data);
        setDeckData(response.data);
    
      } catch (error) {
        console.error('Error fetching deck data:', error);
      }
    };

    fetchDeckData();
  }, []);

  
  const generateDeckUrl = (deckData) => {
    const url = deckData && deckData.data && deckData.data.deck && deckData.data.deck[0] && deckData.data.deck[0].imgUrl;
    let newUrl = null;

    if (url) {
      const lastIndex = url.lastIndexOf('/');
      const index = url.substring(lastIndex + 1, url.lastIndexOf('.'));
      newUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/${index}.gif`;
    } else {
      console.error('imgurl not fetched');
    }

    return newUrl;
  };

  const generateOpponentDeckUrl = (opponentDeck) => {
    const opponentUrl = opponentDeck &&  opponentDeck?.length > 0 && opponentDeck[0]?.imgUrl;
    let newUrl = null;
  
    if (opponentUrl) {
      const lastIndex = opponentUrl.lastIndexOf('/');
      const index = opponentUrl.substring(lastIndex + 1, opponentUrl.lastIndexOf('.'));
      newUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${index}.gif`;
    } else {
      console.log("url",newUrl);
      console.error('Opponent imgurl not fetched');
      socket.emit('demand-deck','deck is needed')
    }
  
    return newUrl; 
  };
  
  
  const opponentDeckUrl = generateOpponentDeckUrl(opponentDeck);
  console.log(opponentDeckUrl);
  const mainDeckUrl = generateDeckUrl(deckData);



  // console.log(newUrl);

  
  return (
    <div className="grid items-center justify-center w-full gap-1" id='battle'>
      <div className="relative w-lvw h-96" style={{ backgroundImage: "url('/battleBackground2.png')", backgroundSize: "cover", backgroundPosition: "center" , objectFit:"fill" }}>
        <div className="flex justify-around items-center ">
          <div className="grid items-center justify-center w-full gap-4 right-full ">
            <div className="grid items-center justify-center gap-2 pr-80 pt-64">
              <div className="flex items-center gap-2">
                <img
                  alt={deckData?.data.deck[0].name}
                  height="96"
                  src={mainDeckUrl}
                  style={{
                    aspectRatio: "120/120",
                    objectFit: "cover",
                  }}
                  width="96"
                />
                <div className="grid items-center gap-1">
                  <h3 className="text-lg font-bold">{deckData?.data.deck[0].name}</h3>
                  <div className="flex rounded-full border border-gray-200 w-full h-2">
                    <div className="rounded-full bg-green-500 w-1/2 h-2" />
                  </div>
                  <p className="text-sm font-medium">{`HP: ${deckData?.data.deck[0].hp}`}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid items-center justify-center w-full gap-4">
            <div className="grid items-center justify-center gap-2 pl-80 pb-56">
              <div className="flex items-center gap-2">
              {opponentDeck && opponentDeck.length > 0 && opponentDeck[0] && (
                      <img
                        alt={opponentDeck[0].name}
                        height="96"
                        src={opponentDeckUrl}
                        style={{
                          aspectRatio: '120/120',
                          objectFit: 'cover',
                        }}
                        width="96"
                      />
                    )}

                <div className="grid items-center gap-1  ">
                  <h3 className="text-lg font-bold">{opponentDeck[0]?.name}</h3>
                  <div className="flex rounded-full border border-gray-200 w-full h-2">
                    <div className="rounded-full bg-green-500 w-1/2 h-2" />
                  </div>
                  <p className="text-sm font-medium">{`HP: ${opponentDeck[0]?.hp}`}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
       
      <div className='flex flex-row-2'>
        {waiting ? (
          <div className=" bottom-44 left-0 w-full h-28 bg-white bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-lg font-semibold">Wait for your turn...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1 w-auto border-2 rounded-md m-2 p-2 border-orange-100">
              <h1 className='font-semibold text-xl'>Attacks</h1>
              <div className='grid grid-cols-4 gap-2'>
                  {deckData?.data.deck[0].attacks.map((attack, index) => (
                    <button key={index} className='border-amber-400' onClick={playerTurn ? handleAttack : undefined}>
                      {attack.name}
                    </button>
                  ))}
          

              </div>
            </div>
            <div className="flex flex-col gap-1 w-auto border-2 rounded-md m-2 p-2 border-orange-100">
              <h1 className='font-semibold text-xl'>Bag Items</h1>
              <div className='grid grid-cols-4 gap-2'>
                <Button size="sm" variant="outline">
                  Revive
                </Button>
                <Button size="sm" variant="outline">
                  Potion
                </Button>
                <Button size="sm" variant="outline">
                  Super Potion
                </Button>
                <Button size="sm" variant="outline">
                  Max potion
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-1 w-auto border-2 rounded-md m-2 p-2 border-orange-100">
        <h1 className='font-semibold text-xl'>Battle Log</h1>
        <p className="text-sm">Charizard dealt 50 damage</p>
        <p className="text-sm">Blastoise attacked 50 damage</p>
      </div>
    </div>
  );
};

export default Page;