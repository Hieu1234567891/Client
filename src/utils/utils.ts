export const convertSecondsToHoursMinutesSeconds = (
  seconds: number,
): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  let result = "";
  if (hours > 0) {
    result += `${hours} giờ `;
  }
  if (minutes > 0) {
    result += `${minutes} phút `;
  }
  if (remainingSeconds > 0) {
    result += `${remainingSeconds} giây`;
  }
  return result.trim();
};
export function shortenName(name: string): string {
  return name.length > 12 ? name.substring(0, 50) + "..." : name;
}
