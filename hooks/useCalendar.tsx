import { Calendar, Month } from "@/models/models";
import { useState } from "react";



export function useCalendar() {
    const [calendar, setCalendar] = useState<Calendar>([
        {
            month: 'january',
            vegetables: []
        },
        {
            month: 'february',
            vegetables: []
        },
        {
            month: 'march',
            vegetables: []
        },
        {
            month: 'april',
            vegetables: []
        },
        {
            month: 'may',
            vegetables: []
        },
        {
            month: 'june',
            vegetables: []
        },
        {
            month: 'july',
            vegetables: []
        },
        {
            month: 'august',
            vegetables: []
        },
        {
            month: 'september',
            vegetables: []
        },
        {
            month: 'october',
            vegetables: []
        },
        {
            month: 'november',
            vegetables: []
        },
        {
            month: 'december',
            vegetables: []
        },
    ]);

    function monthToFrench(month: Month): string {
        switch (month) {
            case 'january':
                return 'Janvier'
            case 'february':
                return 'Février'
            case 'march':
                return 'Mars'
            case 'april':
                return 'Avril'
            case 'may':
                return 'Mai'
            case 'june':
                return 'Juin'
            case 'july':
                return 'Juillet'
            case 'august':
                return 'Août'
            case 'september':
                return 'Septembre'
            case 'october':
                return 'Octobre'
            case 'november':
                return 'Novembre'
            case 'december':
                return 'Décembre'
        }
    }

    return {
        calendar,
        monthToFrench
    };
}
