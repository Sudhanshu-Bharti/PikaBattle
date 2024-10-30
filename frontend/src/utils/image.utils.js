export const generateDeckUrl = (deckData) => {
    const url = deckData?.data?.deck?.[0]?.imgUrl;
    if (!url) return null;
  
    const lastIndex = url.lastIndexOf("/");
    const index = url.substring(lastIndex + 1, url.lastIndexOf("."));
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/${index}.gif`;
  };
  
  export const generateOpponentDeckUrl = (opponentDeck) => {
    const opponentUrl = opponentDeck?.[0]?.imgUrl;
    if (!opponentUrl) return null;
  
    const lastIndex = opponentUrl.lastIndexOf("/");
    const index = opponentUrl.substring(lastIndex + 1, opponentUrl.lastIndexOf("."));
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${index}.gif`;
  };
  