import Moralis from "moralis";

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjBkNWE2MjM1LTliNWItNDQ2MS1hZWU3LTA2YzJiMmYxNzcyOSIsIm9yZ0lkIjoiNDEyNzcxIiwidXNlcklkIjoiNDI0MTg5IiwidHlwZUlkIjoiNTJjYTAwOWUtNmUxNi00OTYwLTk3N2EtMDk5M2NkOTM4OWM4IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3Mjk1MzA3MzIsImV4cCI6NDg4NTI5MDczMn0.4h4TZZtXHNsEwBd6HiAJ0RwaqIGKoYi_uQ2-l6JF5-4';

const initMoralis = async () => {
    Moralis.start({ apiKey });
};

export default initMoralis;