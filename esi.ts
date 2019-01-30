class SearchFrame {
    private elem: HTMLElement;

    static readQs = (rawQs: string): Object => {
        if (rawQs.trim() === '') return {};

        const entries = rawQs.split('&');

        const b = {};
        for (let entry of entries) {
            const p = entry.split('=', 2);
            if (p.length === 1) {
                b[p[0]] = '';
            } else {
                b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' '));
            }
        }
        return b;
    };

    static serialize = (obj: object): string => {
        const str = [];
        for (let p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    };

    constructor(public parentElem: HTMLElement) {
        this.elem = document.createElement('iframe');
        this.setupElem();
        this.attachEvents();
    }

    setupElem = (): void => {
        const qs = SearchFrame.readQs(window.location.search.substr(1));
        const q = qs['q'] || '*';
        const s = qs['s'] || 'popularity';
        const p = qs['p'] || '1';
        const src = `https://search.esteem.app/search-iframe?q=${encodeURIComponent(q)}&s=${s}&p=${p}`;
        this.elem.setAttribute('src', src);
        this.elem.setAttribute('frameborder', '0');
        this.elem.setAttribute('scrolling', 'no');
        this.elem.style.width = '100%';
        this.elem.style.height = '400px';
        this.parentElem.appendChild(this.elem);
    };

    attachEvents = (): void => {
        window.addEventListener('message', (e: MessageEvent) => {

            const qs = SearchFrame.readQs(window.location.search.substr(1));
            const {type} = e.data;

            switch (type) {
                case 'height':
                    const {height} = e.data;
                    this.elem.style.height = height + 'px';
                    break;
                case 'sort':
                    const {sort} = e.data;
                    qs['s'] = sort;
                    window.location.href = `?${SearchFrame.serialize(qs)}`;
                    break;
                case 'query':
                    const {query} = e.data;
                    window.location.href = `?${SearchFrame.serialize({q: query, s: 'popularity', p: 1})}`;
                    break;
                case 'page':
                    const {page} = e.data;
                    qs['p'] = page;
                    window.location.href = `?${SearchFrame.serialize(qs)}`;
                    break;
            }
        });
    }
}

new SearchFrame(document.getElementById('search-results'));

// export default SearchFrame;