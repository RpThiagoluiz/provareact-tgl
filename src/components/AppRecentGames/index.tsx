import { Link } from "react-router-dom";
import { HiOutlineArrowRight } from "react-icons/hi";
import {
  Container,
  Empty,
  ButtonGame,
  CartItem,
  NewBetContainer,
  BetContainer,
} from "./styles";
import { useSelector } from "react-redux";
import {
  currencyValue,
  formatNumberInArray,
  dateFormatValue,
} from "../../utils";
import { EmptyCart } from "../EmptyCart";
import { ModalError } from "../ModalError";
import { useEffect, useState } from "react";
import { GameTypesProps } from "../../@types/GameTypes";
import { ErrorProps } from "../../@types/Error";
import { api } from "../../services/api";
import { LoadingSpinner } from "../LoadingSpiner";
import { AppGamesApiResponse } from "../AppGamesApiResponse";
import { AppRecentUserGame } from "../AppRecentUserGame";

export const AppRecentGames = () => {
  const [apiReponse, setApiResponse] = useState<GameTypesProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gameChoice, setGameChoice] = useState<GameTypesProps>({
    type: "",
    description: "",
    range: 0,
    price: 0,
    "max-number": 0,
    color: "",
    "min-cart-value": 0,
  });
  const [messageToUser, setMessageToUser] = useState<ErrorProps>({
    title: "",
    description: "",
    color: "",
    active: false,
  });
  const [] = useState();

  const { games } = useSelector((state: any) => state.cart);

  useEffect(() => {
    async function getGames() {
      setIsLoading(true);
      try {
        await api.get<GameTypesProps[]>("/types").then((response) => {
          const { data } = response;

          setIsLoading(false);
          setApiResponse(data);
        });
      } catch (error) {
        setMessageToUser({
          title: "Request Error",
          description: "500 - Internal Server Error",
          color: "var(--red)",
          active: true,
        });
      }
    }
    setIsLoading(false);
    getGames();
  }, []);

  const toggleModal = () => {
    setMessageToUser({ title: "", description: "", color: "", active: false });
  };

  const modal = (
    <ModalError
      color={messageToUser.color}
      title={messageToUser.title}
      description={messageToUser.description}
      onClickClose={toggleModal}
    />
  );

  const handleButtonGameMode = (gameType: string) => {
    setIsLoading(true);
    const result = apiReponse.filter((game) => game.type === gameType);
    const gameChoice = [...result];

    setGameChoice(gameChoice[0]);
    setIsLoading(false);
    //console.log(gameChoice[0].type);
  };

  return (
    <>
      {messageToUser.active && modal}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Container>
          <BetContainer>
            <section>
              <h2>RECENT GAMES</h2>
              <span>Filters</span>
              <div>
                {/* {apiReponse.map((game) => (
                  <ButtonGame
                    key={game.type}
                    color={game.color}
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                      event.preventDefault();
                      handleButtonGameMode(game.type);
                    }}
                    isActive={game.type === gameChoice.type}
                  >
                    {game.type}
                  </ButtonGame>
                ))} */}

                <AppGamesApiResponse
                  apiReponse={apiReponse}
                  gameChoice={gameChoice}
                  handleButtonGameMode={handleButtonGameMode}
                />
              </div>
            </section>

            <AppRecentUserGame games={games} filter={gameChoice} />

            {/* {!!games.length ? (
              games.map((game: any) => (
                <CartItem key={game.id} color={game.color}>
                  <p>{formatNumberInArray(game.gameNumbers)}</p>
                  <div>
                    <p>
                      {dateFormatValue(new Date(game.betDate))} - (
                      {currencyValue(game.price)})
                    </p>
                  </div>
                  <strong>{game.type}</strong>
                </CartItem>
              ))
            ) : (
              <Empty>
                <EmptyCart color="var(--red)" />
              </Empty>
            )} */}
          </BetContainer>
          <NewBetContainer>
            <Link to="/newbet"> New Bet</Link> <HiOutlineArrowRight />
          </NewBetContainer>
        </Container>
      )}
    </>
  );
};
