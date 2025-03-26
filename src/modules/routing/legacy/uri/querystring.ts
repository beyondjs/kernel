export class QueryString extends Map {
    constructor(search: string) {
        super();

        if (search.trim() === '') return;
        search = (search.substr(0, 1) === '?') ? search.substr(1) : search;
        const split = search.split('&');

        for (let i = 0; i < split.length; ++i) {
            const param = split[i].split('=', 2);
            const value = param[1] ?
                decodeURIComponent(param[1].replace(/\+/g, ' ')) : undefined;
            this.set(param[0], value);
        }
    }
}
