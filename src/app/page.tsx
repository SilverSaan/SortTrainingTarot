"use client";
import Container from "@mui/material/Container";
import { Circle, ThumbDown, ThumbUp, Title } from "@mui/icons-material";
import {Card, Box, Button, ButtonGroup, Grid, Paper, Typography, CardContent, Fab } from "@mui/material";
import { SetStateAction, use, useEffect, useState } from "react";
import { getCardMap } from "@/util/util";
import axios from "axios";
import { analyseComplexValue, motion } from "framer-motion";
import { small } from "framer-motion/client";
import CheckIcon from '@mui/icons-material/Check';

export default function Home() {
    const [cardMap, setCardMap] = useState<Record<number, string>>({}); // {0 : "0 The Fool.jpeg"}
    const [order, setOrder] = useState<number[]>([]); // track drag order
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null); // To track while dragging
    const [isSorted, setIsSorted] = useState(false);

    useEffect(() => { //Used Axios because I'm more used to it, fetch would probably be the best 
      axios.get("/api/card")
        .then(res => {
          setCardMap(res.data);
          // initialize order as sorted by card number
          setOrder(Object.keys(res.data).map(num => parseInt(num, 10)));
        })
        .catch(err => console.error("Error loading cards:", err));
    }, []);


    useEffect(() => {
      setIsSorted(checkIsSorted());
 

    }, [order]); //Everytime order changes call this


    const handleDragStart = (index: number) => setDraggingIndex(index);

    const handleDragEnter = (index: number) => {
      if (draggingIndex === null || draggingIndex === index) return;
      const newOrder = [...order];
      const temp = newOrder[index];
      newOrder[index] = newOrder[draggingIndex];
      newOrder[draggingIndex] = temp;
      setDraggingIndex(index);
      setOrder(newOrder);
    };

  const handleDragEnd = () => setDraggingIndex(null);

  const shuffleCards = () => { 
    const shuffled = [...order];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setOrder(shuffled);
  }

  const sleep = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms));

  function checkIsSorted(){
    let arr = [...order]
    let sorted = true
    for(let i = 1; i < arr.length; i++){
      if (arr[i] < arr[i -1]){
        sorted = false;
        return sorted;
      }
    }
    return sorted; 
  }

  const bubbleSort = async () => {
    // To exemplify the animation, each step will be delayed by 300ms
    const arr = [...order];
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) { 
        
        if (arr[j] > arr[j + 1]) {
          // This is simpler to understand than previous code that used the ^ operator
          // The ^ Operator is the bitwise XOR operator, it can be used to compare equality (x ^ x == 0)
          /*
          The previous code used the XOR operator in the following ways: 
          
          Replace arr[j] with the bitwise XOR of the two values.
          arr[j] = arr[j] ^ arr[j + 1];
          After this line: arr[j] === (original arr[j]) ^ (original arr[j+1])
          
          arr[j + 1] = arr[j] ^ arr[j + 1];
          So after this line arr[j + 1] is equal to arr[j] because arr[j + 1] = original_arr[j] ^ original_arr[j+1] ^ or original_arr[j+1]
          original_arr[j+1] ^ or original_arr[j+1] == 0 
          any number a XOR 00000000 is equal to a 

          The same happens on the other side
          arr[j] = arr[j] ^ arr[j + 1];
          which is for the original arr
          arr[j] ^ arr[j + 1] ^ arr[j] ^ arr[j + 1] ^ arr[j + 1]
          cut the repeated values and then you'll have 
          arr[j] = original arr[j+1]
          So arr[j] becomes the original arr[j+1].
          */

          let temp = arr[j+1]
          arr[j + 1] = arr[j] 
          arr[j] = temp
          setOrder([...arr]);  
          await sleep(100);

        }

      }
    }
  }

  const selectionSort = async () => {
    console.log("WOW")
    const arr = [...order]; 
    const n = arr.length; 

    for(let i = 0; i < n; i++){
      let smallest = i
      for(let j = i; j < n; j++){
        if (arr[smallest] > arr[j]){
          smallest = j
        }
      }
      let temp = arr[i]
      arr[i] = arr[smallest]
      arr[smallest] = temp 
      setOrder([...arr])
      await sleep(100)
    }

  }

  const insertionSort = async () => {
    const arr = [...order]
    const n = arr.length;
    
    for(let i = 1; i < n; i++){
      let key = arr[i]
      let j = i - 1

      while (j >= 0 && arr[j] > key){
        arr[j + 1] = arr[j]
        j = j -1
      }

      arr[j+1] = key
      setOrder([...arr])
      await sleep(300)
    }

  }

  

  const mergeSort = async () => {
    const arr = [...order];
    let b: number[] = new Array(arr.length); // Had to allocate this to allow async function to not duplicate

    async function mergeSortNonRecursiveStep(low: number, mid: number, high: number) {
      let l1 = low, l2 = mid + 1, i = low;

      // Filling B to allow this to be async.
      while (l1 <= mid && l2 <= high) {
        if (arr[l1] < arr[l2]) {
          b[i++] = arr[l1++];
        } else {
          b[i++] = arr[l2++];
        }
      }
      while (l1 <= mid) {
        b[i++] = arr[l1++];
      }
      while (l2 <= high) {
        b[i++] = arr[l2++];
      }

      for (let k = low; k <= high; k++) {
        arr[k] = b[k];
        
      }
    }

    async function sort(low: number, high: number) {
      if (low < high) {
        const mid = Math.floor((low + high) / 2);
        await sort(low, mid);
        setOrder([...arr]);
        await sleep(100);
        await sort(mid + 1, high);
        setOrder([...arr]);
        await sleep(100);
        await mergeSortNonRecursiveStep(low, mid, high);
        setOrder([...arr]);
        await sleep(100);
      }
    }

    await sort(0, arr.length - 1);
  };

  // Another divide and conquer algorithm, doing the steps async (So they use sleep) will be the biggest problem here
  // So gonna do everything in One recursive function
  const quickSort = async () => {
    const arr = [...order] // Copy order 
    
    async function sort(low:number, high:number) {
      if (low < high){
        let i = low - 1
        let p = high

        for(let it = low; it < high; it++){
          if (arr[it] < arr[p]){
            i++

            let temp = arr[i]
            arr[i] = arr[it]
            arr[it] = temp
            setOrder([...arr]);
            await sleep(100)

          }   
        }

        i++
        let temp = arr[i]
        arr[i] = arr[p]
        arr[p] = temp
        setOrder([...arr]);
        await sleep(100)

        await sort(low, i - 1)
        await sort(i + 1, high)
      }
    }

    sort(0, arr.length - 1)
  }




    
  return (
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Typography variant="subtitle1" gutterBottom>
          A simple app to sort tarot cards that I made after failing a interview in bubble sort because of nerves :P (For Study, little to no AI used)
          - Pedro Silveira 
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          I Used AI to help me with the framer motion parts, but the rest is all me.
        </Typography>

        <Grid container spacing={2}>
          <Grid size={8}>
            <Paper elevation={24} style={{padding: "1em", marginTop: "1em", width: "100%", height:"600px"} }>
              <Grid container spacing={2}>
                {order.map((num, index) => (
                  <Grid key={num} size={1.3} >
                    <motion.div layout transition={{ duration: 0.5, type: "spring" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}>

                    
                    <Card 
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragEnter={() => handleDragEnter(index)}
                      onDragEnd={handleDragEnd}
                      style={{
                        height: "150px",
                        cursor: "grab",
                        opacity: draggingIndex === index ? 0.5 : 1,
                        transition: "0.2s",
                      }}
                    >
                      <CardContent style={{ padding: 0 }}>
                        {cardMap[num] ? (
                          <img
                            src={cardMap[num]}
                            alt={`Card ${num}`}
                            style={{ width: "100%", display: "block" }}
                          />
                        ) : (
                          <div style={{ width: "100%", height: 150, background: "#eee" }} />
                        )}
                      </CardContent>
                    </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
          <Grid size={4}>
            <ButtonGroup orientation="vertical" variant="contained" aria-label="vertical contained button group" fullWidth style={{marginTop: "1em"}}>
              <Button onClick={shuffleCards}>Shuffle</Button>
              <Button onClick={bubbleSort}>Bubble Sort</Button>
              <Button onClick={selectionSort}>Selection Sort</Button>
              <Button onClick={insertionSort}>Insertion Sort</Button>
              <Button onClick={mergeSort}>Merge Sort</Button>
              <Button onClick={quickSort}>Quick Sort</Button>
              <Button>Heap Sort</Button>
            </ButtonGroup>

            <Fab
              color={isSorted ? "success" : "error"}  // green or red
              aria-label={isSorted ? "sorted" : "unsorted"}
            >
              {isSorted ? <ThumbUp /> : <ThumbDown />}
            </Fab>
          </Grid>
        </Grid>

      </Box>

      
  );



}
