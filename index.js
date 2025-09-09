export default class Deck {
  constructor(deckId = null, count = 1, jokers = false, shuffle = true) {
    this.deckId = deckId; // use existing deckId if provided
    this.backImage = "https://www.deckofcardsapi.com/static/img/back.png";
    this._ready = this._init(count, jokers, shuffle);
  }

  // Private async initializer
  async _init(count, jokers, shuffle) {
    if (this.deckId) return; // skip if deckId already exists

    let url = shuffle
      ? new URL("https://www.deckofcardsapi.com/api/deck/new/shuffle/")
      : new URL("https://www.deckofcardsapi.com/api/deck/new/");

    url.searchParams.append("deck_count", count);
    if (jokers) url.searchParams.append("jokers_enabled", true);

    const res = await fetch(url);
    const data = await res.json();
    this.deckId = data.deck_id;
  }

  async _ensureReady() {
    if (!this._ready) return;
    await this._ready;
  }

  async draw(count = 1) {
    await this._ensureReady();
    const url = new URL(
      `https://www.deckofcardsapi.com/api/deck/${this.deckId}/draw/`
    );
    url.searchParams.append("count", count);

    const res = await fetch(url);
    const data = await res.json();
    return { cards: data.cards, remaining: data.remaining };
  }

  async shuffle(remaining = true) {
    await this._ensureReady();
    const url = new URL(
      `https://www.deckofcardsapi.com/api/deck/${this.deckId}/shuffle/`
    );
    if (remaining) url.searchParams.append("remaining", true);

    const res = await fetch(url);
    return await res.json();
  }

  // Pile functions remain the same
  async addToPile(pileName, cards) {
    await this._ensureReady();
    const cardsParam = Array.isArray(cards)
      ? cards.map((c) => c.code).join(",")
      : cards;
    const url = new URL(
      `https://www.deckofcardsapi.com/api/deck/${this.deckId}/pile/${pileName}/add/`
    );
    url.searchParams.append("cards", cardsParam);
    const res = await fetch(url);
    return await res.json();
  }

  async drawFromPile(pileName, count = 1) {
    await this._ensureReady();
    const url = new URL(
      `https://www.deckofcardsapi.com/api/deck/${this.deckId}/pile/${pileName}/draw/`
    );
    url.searchParams.append("count", count);
    const res = await fetch(url);
    const data = await res.json();
    return {
      cards: data.cards,
      remaining: data.piles[pileName]?.remaining || 0,
    };
  }

  async shufflePile(pileName) {
    await this._ensureReady();
    const url = new URL(
      `https://www.deckofcardsapi.com/api/deck/${this.deckId}/pile/${pileName}/shuffle/`
    );
    const res = await fetch(url);
    return await res.json();
  }

  async listPile(pileName) {
    await this._ensureReady();
    const url = new URL(
      `https://www.deckofcardsapi.com/api/deck/${this.deckId}/pile/${pileName}/list/`
    );
    const res = await fetch(url);
    const data = await res.json();
    return data.piles[pileName]?.cards || [];
  }
}
