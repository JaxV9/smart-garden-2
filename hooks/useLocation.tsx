import { useEffect, useState } from "react";

export interface Department {
    nom: string,
    code: string,
    codeRegion: string
}

export interface Commune {
    nom: string,
    code: string,
    codesPostaux: string[]
}

export function useLocation() {

    const [currentDepartement, setCurrentDepartement] = useState<Department | undefined>(undefined);
    const [currentCommune, setCurrentCommune] = useState<Commune | undefined>(undefined);

    const [departmentInputText, setDepartmentInputText] = useState<string>('');
    const [communeInputText, setCommuneInputText] = useState<string>('')

    const [departementPropositions, setDepartmentPropositions] = useState<Department[]>([]);
    const [communesPropositions, setCommunesPropositions] = useState<Commune[]>([]);

    const [departments, setDepartments] = useState<Department[]>([])

    const [communes, setCommunes] = useState<Commune[]>([])

    const departmentsApiUrl = 'https://geo.api.gouv.fr/departements/';

    function getCommunesUrl(code: string) {
        return `https://geo.api.gouv.fr/departements/${code}/communes`;
    }

    async function loadDepartments(): Promise<void> {
        const response = await fetch(departmentsApiUrl);
        if (!response.ok) {
            throw new Error(`Impossible de charger les départements.`);
        }

        const data = (await response.json()) as Department[];
        setDepartments(data);
    }

    async function loadCommunes(code: string) {
        const communesUrl = getCommunesUrl(code);
        const response = await fetch(communesUrl);

        if (!response.ok) {
            throw new Error(`Impossible de charger les départements.`);
        }

        const data = (await response.json()) as Commune[];
        setCommunes(data);
    }

    function departmentListener(event: string): void {
        setDepartmentInputText(event);
        setCurrentDepartement(undefined);
        if (event === '') {
            setDepartmentPropositions([])
            return
        }
        if (Number(event)) {
            const values = departments.filter((department) =>
                department.code.includes(event)
            ).slice(0, 5);
            setDepartmentPropositions(values)
            return;
        }
        const values = departments.filter((department) => {
            const lowerEvent = event.toLowerCase()
            const name = department.nom.toLowerCase()
            return name.includes(lowerEvent)
        }).slice(0, 5);
        setDepartmentPropositions(values);
    }

    function communesListener(event: string): void {
        setCommuneInputText(event);
        setCurrentCommune(undefined);
        if (event === '') {
            setCommunesPropositions([])
            return
        }
        if (Number(event)) {
            const values = communes.filter((commune) =>
                commune.code.includes(event)
            ).slice(0, 5);
            setCommunesPropositions(values)
            return;
        }
        const values = communes.filter((commune) => {
            const lowerEvent = event.toLowerCase()
            const name = commune.nom.toLowerCase()
            return name.includes(lowerEvent)
        }).slice(0, 5);
        setCommunesPropositions(values);
    }

    function selectDepartment(department: Department): void {
        setCurrentDepartement(department);
        setDepartmentInputText(`${department.code} - ${department.nom}`);
        setDepartmentPropositions([]);
    }

    function selectCommune(commune: Commune): void {
        setCurrentCommune(commune);
        setCommuneInputText(`${commune.code} - ${commune.nom}`);
        setCommunesPropositions([]);
    }

    useEffect(() => {
        if (currentDepartement) {
            loadCommunes(currentDepartement.code);
        }
    }, [currentDepartement])

    return {
        currentDepartement,
        departmentInputText,
        communeInputText,
        departments,
        departementPropositions,
        communesPropositions,
        communes,
        selectDepartment,
        selectCommune,
        loadDepartments,
        departmentListener,
        communesListener
    }
}