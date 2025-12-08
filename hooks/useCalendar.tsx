import { useGardenContext } from "@/contexts/garden.context";
import { Calendar, Month, Vegetable, VegetablePlannification } from "@/models/models";
import { useEffect, useState } from "react";



export function useCalendar() {

    const { gardenVegetables } = useGardenContext()

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

    function monthVegetables(month: string, type: VegetablePlannification): {
        vegetable: Vegetable;
        type: VegetablePlannification;
    }[] {
        const vegetables = gardenVegetables.filter((vegetable) => {
            return vegetable[type].includes(month);
        });

        return vegetables.map(vegetable => {
            return {
                vegetable: vegetable,
                type: type
            }
        })
    }

    useEffect(() => {
        if (gardenVegetables.length > 0) {
            const calendarVegetables = calendar.map((calendar) => {
                const sowingVegetables = monthVegetables(calendar.month, 'sowing');
                const harvestVegetables = monthVegetables(calendar.month, 'harvest');
                const plantationVegetables = monthVegetables(calendar.month, 'plantation');
                calendar.vegetables = [...sowingVegetables, ...harvestVegetables, ...plantationVegetables]
                return calendar
            })
            setCalendar(calendarVegetables);
        }
    }, [gardenVegetables])

    return {
        calendar,
        monthToFrench
    };
}
