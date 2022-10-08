import { GithubUser } from './GithubUser.js';

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root);
        this.tbody = this.root.querySelector("table tbody");

        this.load();
    }

    load() {
        this.users = JSON.parse(localStorage.getItem('@github-favorites:')) || [];
        console.log(this.users)
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.users));
    }

    delete(user) {
        const filteredUsers = this.users.filter(u => u.login !== user.login);

        this.users = filteredUsers;
        this.update();
        this.save();
    }

    async add(username) {
        try {
            const verifyUserExists = this.users.find(user => user.login === username);

            if(verifyUserExists) {
                throw new Error(`O usuário ${username} já está nos favoritos!`);
            }

            const user = await GithubUser.search(username);

            if(typeof user.login === 'undefined') {
                throw new Error('Usuário não encontrado')
            };

            this.users = [user, ...this.users];
            this.update();
            this.save();

            console.log(user)
        } catch (err) {
            alert(err);
        }
    }
}

export class FavoritesViews extends Favorites {
    constructor(root) {
        super(root);

        this.update();
        this.onAdd();
    }

    onAdd() {
        const addButton = this.root.querySelector('.search button');
        const inputSearch = this.root.querySelector('.search input');

        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input');

            this.add(value);
            this.clearInput();
        }

        inputSearch.addEventListener('keypress', (event) => {
            event.key === 'Enter' && this.add(event.target.value) && this.clearInput();
        })
    }

    update() {
        this.removeAllTr();

        this.users.forEach(user => {
            const row = this.createRow();
            
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`;
            row.querySelector('.user img').alt = user.name + " image";
            row.querySelector('.user p').textContent = user.name;
            row.querySelector('.user a').setAttribute('href', `https://github.com/${user.login}`);
            row.querySelector('.user span').innerText = user.login;
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

    clearInput() {
        const inputSearch = this.root.querySelector(".search input");
        inputSearch.value = "";
        return;
    }
}