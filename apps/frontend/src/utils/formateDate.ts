export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC"
  });
};

export const formatDayMonth = (dateString: string) => {
  const date = new Date(dateString);

  const months = [
    "ENE","FEB","MAR","ABR","MAY","JUN",
    "JUL","AGO","SEP","OCT","NOV","DIC"
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];

  return { day, month };
};