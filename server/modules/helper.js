// Helper functions
const dateCheck = (date, currentDate) => {
    if (
      (currentDate.getTime() - date.getTime()) / (1000 * 3600 * 24) <= 30 ||
      isNaN(date)
    ) {
      return true;
    } else {
      return false;
    }
  };

  export { dateCheck }