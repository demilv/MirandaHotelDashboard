export const LoginAPI = async (): Promise<void> => {
    try {
        const name = import.meta.env.VITE_NAME;
        const password = import.meta.env.VITE_PASSWORD;

        const formData = {
            name,
            password
        };

        const MIAPI = import.meta.env.VITE_MIAPI;

        const response = await fetch(`${MIAPI}/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error('Error al hacer login en la API:', errorMessage);
            return;
        }

        const data = await response.json();
        const token = data.token; 

        localStorage.setItem('authorization', token);

        console.log('Token de autorización recibido y almacenado:', token);
    } catch (error) {
        console.error('Error en la solicitud de Login API:', error);
    }
};
