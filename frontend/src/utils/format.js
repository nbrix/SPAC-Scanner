const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function addDollarSign(x) {
  if (x) {
    if (String(x).includes("$")) {
      return x;
    }
    if (x[0] === "-") {
      x = x.replace("-", "-$");
    } else {
      x = "$" + x;
    }
  }

  return x;
}

export function numberWithCommas(x, isDollarSign = false) {
  if (isDollarSign) {
    x = addDollarSign(x);
  }
  if (x) return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  else {
    return "N/A";
  }
}

export function addPercentage(x) {
  return x + "%";
}

export function isAvailable(x) {
  if (x === "0" || x === 0 || x === null) {
    return true;
  }
  return false;
}

export function formatDate(x) {
  if (!x || x === "N/A") return 'N/A';

  const d = new Date(x);

  return (
    months[d.getMonth()] + " " + (d.getDate() + 1) + ", " + d.getFullYear()
  );
}
