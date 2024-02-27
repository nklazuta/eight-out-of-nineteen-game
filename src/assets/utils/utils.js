function getRandomNumber(multiplier) {
  return Math.ceil(Math.random() * multiplier);
}

export default function getUniqueRandomNumber(multiplier, arr) {
  let random = getRandomNumber(multiplier);

  while (arr.includes(random)) {
    random = getRandomNumber(multiplier);
  }

  return random;
}
