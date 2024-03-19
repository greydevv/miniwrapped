import { useState, useEffect } from "react";
import axios from "axios";

type StatisticsTabProps = {
  token: string
};

export default function StatisticsTab({ token }: StatisticsTabProps) {
  const [artists, setArtists] = useState(null);

  // useEffect(() => {
  //   if (!artists) {
  //     const topArtists = queryArtists();
  //     setArtists(topArtists);
  //   }
  // }, []);

  const queryArtists = async () => {
    const { data } = await axios.get("https://api.spotify.com/v1/me/top/artists", {
      headers: {
        "Authorization": `Bearer ${token}`
      },
      params: {
        "time_range": "short_term",
        "limit": 5,
      },
    })
  };

  return (
    <div>HI</div>
  )
}
