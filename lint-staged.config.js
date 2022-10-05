module.exports = {
  "**/*.{js,jsx,ts,tsx}": ["eslint --max-warnings=0", "prettier -w"],
  "**/*.{ts,tsx}": [() => "tsc --skipLibCheck --noEmit"],
  "**/*.{json,css,md}": ["prettier -w"],
};
