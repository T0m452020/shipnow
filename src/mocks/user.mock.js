import { USER_ROLES } from "../constants/user.constants.js";

const firstNames = [
    "Juan",
    "Pedro",
    "Lucía",
    "Martina",
    "Santiago",
    "Camila",
    "Nicolás",
    "Valentina",
];

const lastNames = [
    "Gómez",
    "Rodríguez",
    "Fernández",
    "López",
    "Martínez",
    "Pérez",
    "García",
    "Sosa",
];

const getRandomItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

export const generateMockUser = () => {
    const firstName = getRandomItem(firstNames);
    const lastName = getRandomItem(lastNames);

    return {
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 10000)}@mock.com`,
        password: "123456",
        role: getRandomItem(Object.values(USER_ROLES)),
        isAvailable: Math.random() > 0.5,
    };
};

export const generateMockUsers = (quantity) => {
    return Array.from({ length: quantity }, generateMockUser);
};