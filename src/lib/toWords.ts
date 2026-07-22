// Converts a rupee amount to Indian English words.
// Handles up to 99,99,99,999 (99 crore).

const ones = ["", "One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
  "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];

function twoDigits(n: number): string {
  if (n < 20) return ones[n];
  return (tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "")).trim();
}

function threeDigits(n: number): string {
  if (n >= 100) {
    const h = Math.floor(n / 100);
    const rest = n % 100;
    return ones[h] + " Hundred" + (rest ? " " + twoDigits(rest) : "");
  }
  return twoDigits(n);
}

export function toWords(amount: number): string {
  const total = Math.round(amount * 100);
  const rupees = Math.floor(total / 100);
  const paise  = total % 100;

  if (rupees === 0 && paise === 0) return "Zero Rupees Only";

  const parts: string[] = [];
  let r = rupees;

  const crore = Math.floor(r / 10_000_000); r %= 10_000_000;
  const lakh  = Math.floor(r / 100_000);    r %= 100_000;
  const thou  = Math.floor(r / 1_000);      r %= 1_000;
  const rem   = r;

  if (crore) parts.push(threeDigits(crore) + " Crore");
  if (lakh)  parts.push(twoDigits(lakh)    + " Lakh");
  if (thou)  parts.push(twoDigits(thou)    + " Thousand");
  if (rem)   parts.push(threeDigits(rem));

  let result = parts.join(" ") + " Rupees";
  if (paise) result += " and " + twoDigits(paise) + " Paise";
  return result + " Only";
}
