import './App.css'
import {
  Box,
  Button,
  ChakraProvider,
  NumberInput,
  NumberInputField,
  Text,
  Textarea
} from "@chakra-ui/react";
import theme from "./theme.ts";
import { useState } from "react";

interface Steel {
  steels: Array<SteelDetail>
  total: number
}

interface SteelDetail {
  size: number
  quantity: number
}

function App() {
  const [sizeOfSteels, setSizeOfSteels] = useState<string>()
  const [target, setTarget] = useState<number>()

  const [result, setResult] = useState<Array<Steel>>([])

  const findCombinations = (values: number[], target: number): [number[], number][] => {
    const combinations: [number[], number][] = [];

    while (target > 0) {
      const n = values.length;
      const dp: number[][] = Array.from({ length: n + 1 }, () => Array(target + 1).fill(0));

      for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= target; j++) {
          if (i === 0 || j === 0) {
            dp[i][j] = 0;
          } else if (values[i - 1] <= j) {
            dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - values[i - 1]] + values[i - 1]);
          } else {
            dp[i][j] = dp[i - 1][j];
          }
        }
      }

      const combination: number[] = [];
      let i = n;
      let j = target;
      while (i > 0 && j > 0) {
        if (dp[i][j] !== dp[i - 1][j]) {
          combination.push(values[i - 1]);
          j -= values[i - 1];
        }
        i -= 1;
      }

      combinations.push([combination, dp[n][target]]);

      // Remove the used items from the list
      combination.forEach(item => {
        const index = values.indexOf(item);
        if (index !== -1) {
          values.splice(index, 1);
        }
      });

      // Update the target with the remaining capacity
      target = dp[n][target];
    }

    return combinations;
  }

  const calculateSteel = (values: number[], target: number) => {
    const combinations = findCombinations(values, target);

    const testArr: Array<Steel> = [];
    combinations.forEach((combination) => {
      const steels = new Map<string, number>();
      combination[0].forEach((item) => {
        if (steels.has(item.toString())) {
          const value = steels.get(item.toString()) ?? 1;
          steels.set(item.toString(), value + 1);
        } else {
          steels.set(item.toString(), 1);
        }
      })

      const steel: Steel = {
        steels: [],
        total: combination[1]
      }

      for (const [key, value] of steels) {
        steel.steels.push({ size: parseInt(key), quantity: value });
      }

      testArr.push(steel);
    })
    setResult(testArr);
  }

  const convertToArray = (input: string): Array<number> => {
    return input
      .split(',')
      .map(item => item.trim())
      .map(item => Number(item));
  }

  const totalSteelRods = (result: Array<SteelDetail>): number => {
    return result.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);
  }
  
  return (
    <ChakraProvider theme={theme}>
      <Box display={"flex"} flexDirection={"column"}>
        {/*Navbar */}
        <Box display={"flex"} justifyContent={"center"} my={8}>
          <Text fontSize={"4xl"} fontWeight={"semibold"}>
            Steel Cutting Calculator
          </Text>
        </Box>

        <Box display={"flex"} flexDirection={"column"} gap={3} my={10}>
          <Box display={"flex"} alignItems={"center"}>
            <Box textAlign={"start"} width={"200px"}>
              <Text fontSize={'xl'} fontWeight={"semibold"}>Target:</Text>
            </Box>
            <Box width={"100%"}>
              <NumberInput
                color={"black"}
                variant={"primary"}
                onChange={(value) => setTarget(parseInt(value))}
              >
                <NumberInputField />
              </NumberInput>
            </Box>
          </Box>
          <Box display={"flex"} alignItems={"center"}>
            <Box textAlign={"start"} width={"200px"}>
              <Text fontSize={'xl'} fontWeight={"semibold"}>Size of Steel:</Text>
            </Box>
            <Box width={"100%"}>
              <Textarea
                placeholder='Size of Steel'
                onChange={(e) => setSizeOfSteels(e.target.value)}
                bgColor={"white"}
                color={"black"}
              />
            </Box>
          </Box>
        </Box>

        <Box display={"flex"} justifyContent={"center"}>
          <Button
            colorScheme='teal'
            size='lg'
            onClick={() => calculateSteel(convertToArray(sizeOfSteels ?? ''), target ?? 0)}
          >
            Calculate
          </Button>
        </Box>

        <Box display={"flex"} justifyContent={"center"} my={8}>
          <Text fontSize={"4xl"} fontWeight={"semibold"}>
            Result
          </Text>
        </Box>

        {result.map((item, index) => (
          <Box display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"} m={1} color={"black"}>
            <Box bgColor={"white"} p={7} borderRadius={20}>
              <Box display={"flex"} alignItems={"start"} justifyContent={"center"}>
                <Text fontSize={'xl'} fontWeight={""}>Set {index + 1}:</Text>
                <Box>
                  {item.steels.map((steel, index) => (
                    <Box key={index} display={"flex"}>
                      <Text fontSize={'xl'} fontWeight={"bold"} ml={2}>{steel.size}</Text>
                      <Text fontSize={'xl'} ml={2}>mm x </Text>
                      <Text fontSize={'xl'} fontWeight={"bold"} ml={2}>{steel.quantity}</Text>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box display={"flex"} alignItems={"start"} justifyContent={"center"} bgColor={"#F6FAB9"} borderRadius={8} m={2} p={2}>
                <Text fontSize={'xl'} fontWeight={""}>Total:</Text>
                <Text fontSize={'xl'} fontWeight={"bold"} ml={2}>{item.total}</Text>
                <Text fontSize={'xl'} ml={2}>mm</Text>
              </Box>
              <Box display={"flex"} alignItems={"start"} justifyContent={"center"} bgColor={"#FFEFEF"} borderRadius={8} m={2} p={2}>
                <Text fontSize={'xl'} fontWeight={""}>Total Steel Rods needed:</Text>
                <Text fontSize={'xl'} fontWeight={"bold"} ml={2}>{totalSteelRods(item.steels)}</Text>
              </Box>
            </Box>
          </Box>
        ))}
        {/*<Box display={"flex"} justifyContent={"center"} alignItems={"center"} mb={5}>*/}
        {/*  <Box display={"flex"} alignItems={"center"}>*/}
        {/*    <Text fontSize={'xl'} fontWeight={""}>All Steel Rods must be purchased:</Text>*/}
        {/*    <Text fontSize={'2xl'} fontWeight={"bold"} ml={2}>6</Text>*/}
        {/*  </Box>*/}
        {/*</Box>*/}
      </Box>
    </ChakraProvider>
  )
}

export default App
