import axios from "axios";

const ticketmasterApi = axios.create({
  baseURL: "https://app.ticketmaster.com/",
});

export const getGigsForHomePage = (genreId, sort, city) => {
  const currentDate = new Date();
  return ticketmasterApi
    .get(
      `discovery/v2/events?apikey=AQ2psvkdE5dP1AD9SEmAPZ1Kb5AALDCG&locale=en-gb&startDateTime=${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
      }-${currentDate.getDate()}T00:00:00Z&size=50&sort=${sort}&city=${city}&segmentId=KZFzniwnSyZfZ7v7nJ&genreId=${genreId}`
    )
    .then((response) => {
      return response.data._embedded.events.filter((events) => {
        return (
          events.dates.status.code !== "cancelled" &&
          events.dates.status.code !== "offsale"
        );
      });
    })
    .catch(console.dir);
};
