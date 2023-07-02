import React from 'react'
import {Flex, Button} from "@chakra-ui/react"

function Buttons() {
  return (
    <Flex  flexDir="column" justifyContent="center" alignItems="center" >
        <Flex zIndex={122}>         
            <ButtonComp 
                 bgColor={"#5A5A5A"} color={ "white"} text="NFT PACKS" mr='24px' />
            <ButtonComp 
             bgColor={"#5A5A5A"} color={"white"} text="AVATAR CARDS" mr='24px' />
            <ButtonComp 
             bgColor={"#444444"} color={"white"} text="EG COMICS" mr='24px'  />
        </Flex>
    </Flex>
  )
}

export default Buttons

const ButtonComp = ({bgColor, color, text, ...rest}) => {
    return (
      <Button {...rest} rounded="none" h={["1.5rem", "1.5rem", "2.5rem", "2.5rem"]} w={["3.3rem", "5rem", "12rem", "9rem,"]} px={[0,0,0,0]} bgColor={bgColor} fontWeight="bold" _hover={{backgroundColor: bgColor}} _focus={{backgroundColor: bgColor}} color={color} fontSize={["xs", "md", "md", "xl"]} >{text}</Button>
    )
  }