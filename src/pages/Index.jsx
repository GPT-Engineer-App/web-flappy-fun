import { useState, useEffect, useCallback } from "react";
import { Box, Button, Container, Text, VStack, HStack, IconButton } from "@chakra-ui/react";
import { FaPlay, FaRedo } from "react-icons/fa";

const BIRD_SIZE = 20;
const GRAVITY = 2;
const JUMP_HEIGHT = 50;
const PIPE_WIDTH = 40;
const PIPE_GAP = 150;
const PIPE_SPEED = 2;

const Index = () => {
  const [birdPosition, setBirdPosition] = useState(250);
  const [gameStarted, setGameStarted] = useState(false);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleJump = () => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    setBirdPosition((prev) => Math.max(prev - JUMP_HEIGHT, 0));
  };

  const resetGame = () => {
    setBirdPosition(250);
    setGameStarted(false);
    setPipes([]);
    setScore(0);
    setGameOver(false);
  };

  const generatePipe = useCallback(() => {
    const topHeight = Math.floor(Math.random() * (window.innerHeight - PIPE_GAP));
    const bottomHeight = window.innerHeight - topHeight - PIPE_GAP;
    return { topHeight, bottomHeight, left: window.innerWidth };
  }, []);

  useEffect(() => {
    let interval;
    if (gameStarted && !gameOver) {
      interval = setInterval(() => {
        setBirdPosition((prev) => Math.min(prev + GRAVITY, window.innerHeight - BIRD_SIZE));
        setPipes((prev) => {
          const newPipes = prev.map((pipe) => ({ ...pipe, left: pipe.left - PIPE_SPEED }));
          if (newPipes.length === 0 || newPipes[newPipes.length - 1].left < window.innerWidth - 300) {
            newPipes.push(generatePipe());
          }
          return newPipes.filter((pipe) => pipe.left + PIPE_WIDTH > 0);
        });
      }, 30);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, generatePipe]);

  useEffect(() => {
    const handleCollision = () => {
      for (const pipe of pipes) {
        if (pipe.left < BIRD_SIZE && pipe.left + PIPE_WIDTH > 0 && (birdPosition < pipe.topHeight || birdPosition + BIRD_SIZE > window.innerHeight - pipe.bottomHeight)) {
          setGameOver(true);
          setGameStarted(false);
        }
      }
    };

    if (gameStarted && !gameOver) {
      handleCollision();
      setScore((prev) => prev + 1);
    }
  }, [birdPosition, pipes, gameStarted, gameOver]);

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Flappy Bird</Text>
        <Box position="relative" width="100%" height="500px" bg="blue.100" overflow="hidden">
          <Box position="absolute" top={`${birdPosition}px`} left="50px" width={`${BIRD_SIZE}px`} height={`${BIRD_SIZE}px`} bg="yellow.400" borderRadius="50%" />
          {pipes.map((pipe, index) => (
            <Box key={index} position="absolute" left={`${pipe.left}px`} width={`${PIPE_WIDTH}px`} bg="green.500">
              <Box height={`${pipe.topHeight}px`} />
              <Box height={`${PIPE_GAP}px`} bg="transparent" />
              <Box height={`${pipe.bottomHeight}px`} />
            </Box>
          ))}
        </Box>
        <HStack spacing={4}>
          <IconButton aria-label="Jump" icon={<FaPlay />} size="lg" onClick={handleJump} />
          <IconButton aria-label="Reset" icon={<FaRedo />} size="lg" onClick={resetGame} />
        </HStack>
        <Text fontSize="xl">Score: {score}</Text>
        {gameOver && (
          <Text fontSize="xl" color="red.500">
            Game Over!
          </Text>
        )}
      </VStack>
    </Container>
  );
};

export default Index;
