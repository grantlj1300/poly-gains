import React, { useState, useEffect } from "react";
import StatTables from "./StatTables";
import axios from "axios";

export default function Stats({ userToken }) {
    const [stats, setStats] = useState([]);
    const [user, setUser] = useState();
    const [statsReady, setStatsReady] = useState(false);

    async function fetchUser() {
        try {
            const response = await axios.get(
                "http://localhost:4000/user/" + userToken.id
            );
            return response.data.user;
        } catch (error) {
            //We're not handling errors. Just logging into the console.
            console.log(error);
            return false;
        }
    }

    useEffect(() => {
        fetchUser().then((result) => {
            if (result) {
                setUser(result);
                fetchStats(result.stats).then((result1) => {
                    if (result1) {
                        setStats([result1]);
                        setStatsReady(true);
                    }
                });
            }
        });
    }, []);

    async function fetchStats(Id) {
        try {
            const response = await axios.get(
                "http://localhost:4000/stats/" + Id
            );
            return response.data.stats_list;
        } catch (error) {
            //We're not handling errors. Just logging into the console.
            console.log(error);
            return false;
        }
    }

    async function updateStats(stats) {
        const id = stats[0];
        const records = stats[1];
        try {
            const response = await axios.post(
                "http://localhost:4000/stats/" + id,
                records
            );
            const result = response.data.stats_list;
            setStats(result);
        } catch (error) {
            //We're not handling errors. Just logging into the console.
            console.log(error);
            return false;
        }
    }
    if (statsReady) {
        return (
            <div className="container">
                <StatTables statsData={stats} updateStats={updateStats} />
            </div>
        );
    }
}
