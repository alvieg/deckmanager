# Deck Manager

A ready-to-use card deck manager with **pile support** using the [Deck of Cards API](https://deckofcardsapi.com/). Perfect for building card games like Poker, Blackjack, or custom card-based apps.

---

## Features

- Automatically initializes a new deck on creation  
- Draw cards from the main deck  
- Shuffle the main deck  
- Support for **piles** (add, draw, shuffle, and list cards in piles)  
- Works with Jokers  
- Ready-to-use in Node.js (Node 18+ or with `node-fetch` for older versions)  

---

## Installation

```bash
# If using Node 18+ (fetch is built-in)
npm install deck-manager

# For Node <18
npm install deck-manager node-fetch
```

## Usage

### Initialize Deck

```js
import Deck from "deck-manager";

const deck = new Deck(); // auto-initializes a deck
```

### Draw From Main Deck

```js
const { cards, remaining } = await deck.draw(3);
console.log("Drawn cards:", cards);
console.log("Remaining in deck:", remaining);
```

### Shuffle Deck

```js
await deck.shuffle(); // shuffle the main deck
```

### Working With Piles

```js
// Add cards to a pile
await deck.addToPile("player1", cards);

// Draw from a pile
const pileCards = await deck.drawFromPile("player1", 1);
console.log("Card from pile:", pileCards.cards);

// List all cards in a pile
const remainingPile = await deck.listPile("player1");
console.log("Remaining in pile:", remainingPile);

// Shuffle a pile
await deck.shufflePile("player1");
```

### Example: Deal Hands to Multiple Players

```js
const players = ["Alice", "Bob"];

for (let player of players) {
  const { cards } = await deck.draw(5);  // Draw 5 cards for the player
  await deck.addToPile(player, cards);   // Add to player pile
}

// Show each player's hand
for (let player of players) {
  const hand = await deck.listPile(player);
  console.log(`${player}'s hand:`, hand);
}
```

## API

### Constructor

```js
new Deck(count = 1, jokers = false, shuffle = true)
```