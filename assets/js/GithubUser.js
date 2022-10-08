export class GithubUser {
    static search(username) {
        const baseURL = `https://api.github.com/users/${username}`;

        async function fetchData(endpoint) {
            const response = await fetch(endpoint);
            const data = await response.json();
    
            const { login, name, public_repos, followers } = data;
    
            const user = {
                login,
                name,
                public_repos,
                followers
            };

            return user;
        }

        const data = fetchData(baseURL);
        
        return data;

    }
}