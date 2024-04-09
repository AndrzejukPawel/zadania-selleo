import * as fs from "fs";

const isDigit = (char: string) => {
  const num = Number.parseInt(char);
  if (num >= 0 && num <= 9)
    return num;
  return -1;
}

export const partOne = () => {
  const inputFilePath = "./input.txt";
  const file = fs.readFileSync(inputFilePath, "utf8");
  const lines = file.split("\n");

  const calibration = [];

  lines.forEach(line => {
    if (line.length === 0) return;

    let digit1 = -1;
    let digit2 = -1;

    for (let i = 0; i < line.length && digit1 === -1; i++) {
      digit1 = isDigit(line[i]);
    }

    for (let i = line.length - 1; i >= 0 && digit2 === -1; i--) {
      digit2 = isDigit(line[i]);
    }

    calibration.push(digit1 * 10 + digit2);
  })

  return calibration.reduce((prev, curr) => {
    return prev + curr;
  });
}
