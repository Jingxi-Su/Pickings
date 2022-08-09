# Pick Up the Stars
A web game based on Cocos v2.4.9. 

Players of this game need to manipulate an obtuse monster that never stops jumping to touch the continuously appearing stars. The dazzling acceleration will bring great challenges to players. Play with your friends and see who can obtain the most stars!

## Rules
1. With a purple monster as the center, random stars are generated within a certain range to its left and right
2. Players control the continuous jumping purple monster left and right movement to pick the stars
3. Player will get 1 point for each star eliminated
4. Stars are maintained for a random period of time, with progress bars counting down.
5. The game fails if the star is not picked off when the progress bar ends

## Usage
- Keyboard input
  - A / ⬅️ :accelerate to the left
  - D / ➡️ :accelerate to the right

- Touch input
  - Left side of screen：accelerate to the left
  - Right side of screen：accelerate to the right

## Environment
- Engine：Cocos V2.4.9
- Language：TypeScript
- State management：mobx V6.6.1