export interface SchoolClass {
    id: number;
    school_id: number;
    name: string;
    subjects_extended: string;
    points: number;
    places: number;
    classes: number;
    subjects_included: string;
    professions: string;
}

export interface School {
    id: number;
    name: string;
    region: string;
    county: string;
    commune: string;
    city: string;
    street: string;
    number: string;
    zipCode: string;
    page: string;
    type: string;
    departments: number;
    mail: string;
    phone: string;
    foreign_languages: string;
    classes: string;
    extended_subjects: string;
}

export interface User {
    email: string;
    password: string;
}
