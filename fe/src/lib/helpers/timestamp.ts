export function getTimeInfoFromTimestamp(timestamp : number) {
  const secondsInAnHour = 3600;
  const secondsInADay = 86400;
  const currentTime = Math.floor(Date.now() / 1000);
  const elapsedTime = currentTime - timestamp;

  if (elapsedTime < secondsInADay) {
      const hours = Math.floor(elapsedTime / secondsInAnHour);
      if (hours === 0) {
        return `< 1h`
      }
      return `${hours}h`;
  } else {
      const date = new Date(timestamp * 1000);

      const day = date.getDate();
      const month = getShortenMontAbr(date.getMonth() + 1);
      const year = date.getFullYear();

      return `${day}.${month}.${year}`;
  }
}

export function getShortenMontAbr(month: number) {
  switch (month) {
    case 1:
      return 'Jan';
    case 2:
      return 'Feb';
    case 3:
      return  'Mar';
    case 4:
      return  'Apr';
    case 5:
      return  'May';
    case 6:
      return  'Jun';
    case 7:
      return  'Jul';
    case 8:
      return  'Aug';
    case 9:
      return  'Sep';
    case 10:
      return  'Oct';
    case 11:
      return  'Nov';
    case 12:
      return  'Dec';

    default: return 'invalid number'
  }
}