import { useGardenContext } from "@/contexts/garden.context";
import { Calendar, Month, Vegetable, VegetablePlannification } from "@/models/models";
import { useEffect, useState } from "react";



export function useCalendar() {

    const { gardenVegetables } = useGardenContext()

    const [calendar, setCalendar] = useState<Calendar>([
        {
            month: 'January',
            vegetables: []
        },
        {
            month: 'February',
            vegetables: []
        },
        {
            month: 'March',
            vegetables: []
        },
        {
            month: 'April',
            vegetables: []
        },
        {
            month: 'May',
            vegetables: []
        },
        {
            month: 'June',
            vegetables: []
        },
        {
            month: 'July',
            vegetables: []
        },
        {
            month: 'August',
            vegetables: []
        },
        {
            month: 'September',
            vegetables: []
        },
        {
            month: 'October',
            vegetables: []
        },
        {
            month: 'November',
            vegetables: []
        },
        {
            month: 'December',
            vegetables: []
        },
    ]);

    function monthVegetables(month: Month, type: VegetablePlannification): {
        vegetable: Vegetable;
        type: VegetablePlannification;
    }[] {
        const frenchMonth = monthToFrench(month).toLowerCase();
        const vegetables = gardenVegetables.filter((vegetable) => {
            return vegetable[type].includes(frenchMonth);
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

    function monthToFrench(month: Month): string {
        switch (month) {
            case 'January':
                return 'Janvier'
            case 'February':
                return 'Février'
            case 'March':
                return 'Mars'
            case 'April':
                return 'Avril'
            case 'May':
                return 'Mai'
            case 'June':
                return 'Juin'
            case 'July':
                return 'Juillet'
            case 'August':
                return 'Août'
            case 'September':
                return 'Septembre'
            case 'October':
                return 'Octobre'
            case 'November':
                return 'Novembre'
            case 'December':
                return 'Décembre'
        }
    }

    return {
        calendar,
        monthToFrench
    };
}
