//Classe que vai conter a logica dos dados
//Como os dados serão estruturados
export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root);
        this.tbody = this.root.querySelector("table tbody");

        this.load();
    }

    load() {
        this.users = JSON.parse(localStorage.getItem('@github-favorites:')) || [];
        console.log(this.users)
        /* this.users = [
            {
                login: 'wendelcutrim',
                name: "Wendel Cutrim",
                public_repos: 64,
                followers: 66
            },

            {
                login: 'intwone',
                name: "Cassio Oliveira",
                public_repos: 23,
                followers: 33
            }
        ] */
    }

    delete(user) {
        const filteredUsers = this.users.filter(user => user.login !== user.login);

        this.users = filteredUsers;
        this.update();
    }
}

//Classe que ira criar a visuaização e eventos do HTML
export class FavoritesViews extends Favorites {
    constructor(root) {
        super(root);

        this.update();
    }

    update() {
        this.removeAllTr();

        this.users.forEach(user => {
            const row = this.createRow();
            
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`;
            row.querySelector('.user img').alt = user.name + " image";
            row.querySelector('.user p').textContent = user.name;
            row.querySelector('.user a').setAttribute('href', `https://github.com/${user.login}`);
            row.querySelector('.repositories').innerText = user.public_repos;
            row.querySelector('.followers').innerText = user.followers;

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm("Tem certeza que deseja deletar essa linha?");
                if(isOk) {
                    this.delete(user);
                }

            }

            this.tbody.append(row);
        })
    }

    createRow() {
        const tr = document.createElement('tr');

        const data = `
            <td class="user">
                <img src="https://www.github.com/wendelcutrim.png" alt="Imagem de Wendel Cutrim">
                <a href="https://www.github.com/wendelcutrim" target="_blank">
                    <p>Wendel Cutrim</p>
                    <span>wendelcutrim</span>
                </a>
            </td>
            <td class="repositories">
                64
            </td>
            <td class="followers">
                66
            </td>
            <td>
                <button class="remove">&times;</button>
            </td>
        `
        tr.innerHTML = data;

        return tr;
    }

    removeAllTr() {
        this.tbody.querySelectorAll("tr").forEach(row => {
            row.remove()
        })
    }
}