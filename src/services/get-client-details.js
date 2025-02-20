export async function getClientDetails(id) {
    const url = `http://localhost:3333/clients/${id}`;
    
    const response = await fetch(url)

    return response.json();
}
