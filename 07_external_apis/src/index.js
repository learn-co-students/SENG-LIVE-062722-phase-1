// fetch('https://pokeapi.co/api/v2/pokemon/ditto')
// .then(res => res.json())
// .then(data => console.log(data))

document.addEventListener('DOMContentLoaded', () => {
    // Fetch requests 
        // Function for making a GET request 
        function fetchResource(url){
            return fetch(url)
            .then(res => res.json())
        }

        function createResources(url, body){
            return fetch(url,{
                method: 'POST', 
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })
            .then(res => res.json())
        }

    // Rendering functions
        // Renders Header
        function renderHeader(store){
            document.querySelector('h1').textContent = store.name
        }
        // Renders Footer
        function renderFooter(store){
            const footerDivs = document.querySelectorAll('footer div')
            footerDivs[0].textContent = store.name
            footerDivs[1].textContent = store.address
            footerDivs[2].textContent = store.hours
        }
    
        function renderBookCard(cardData) {
            const li = document.createElement('li')
            const h3 = document.createElement('h3')
            const pAuthor = document.createElement('p')
            const pPrice = document.createElement('p')
            const img = document.createElement('img')
            const btn = document.createElement('button')
    
            h3.textContent = cardData.title
            pAuthor.textContent = cardData.author
            pPrice.textContent = `$${cardData.price}`
            btn.textContent = 'Delete'
    
            img.src = cardData.imageUrl
            li.className = 'list-li'
    
            //Event Listeners 
            btn.addEventListener('click',()=>li.remove())
        
            li.append(h3,pAuthor,pPrice,img,btn)
            document.querySelector('#book-list').append(li)
        }
    
    // Event Handlers
        function handleForm(e){
            e.preventDefault()
            //Builds Book
            const book = {
                title: e.target.title.value,
                author:e.target.author.value,
                price: e.target.price.value,
                imageUrl: e.target.imageUrl.value,
                inventory:e.target.inventory.value,
                reviews:[]
            }
            createResources('http://localhost:3000/books', book)
            .then(renderBookCard)
            .catch(e => console.error(e))

        }

        function handleRenderSearch(){
            // Imperative Syntax
            // const form = document.createElement('form')
            // const label = document.createElement('label') 
            // const input1 = document.createElement('input') 
            // const input2 = document.createElement('input')
            
            // input1.type = "text"
            // input1.name = "search"
            // input1.type = "submit"

            // form.append(label, input1, input2)
            
            // Declarative Syntax
            document.querySelector('main').innerHTML = `
            <form id="api-Search">
                <label>API Search<label>
                <input type="text" name="search"></input>
                <input type="submit"></input>
            </form>
            `

            document.querySelector('#api-search').addEventListener('submit', handleAPIQuery)
        }

        function renderBookResults(book) {
            // Create container for each book
            const div = document.createElement('div');
            const h2 = document.createElement('h2');
            const subtitle = document.createElement('p');
            // const authors = [];
            
            h2.textContent = `Title: ${book.volumeInfo.title}`;
            
            // if (truthy value)
            if(book.volumeInfo.subtitle) {
                subtitle.textContent = `Subtitle: ${book.volumeInfo.subtitle}`;
            } else {
                subtitle.textContent = '(No Subtitle)';
            }
            
            div.append(h2,subtitle);
            
            console.log(book.volumeInfo.authors);

            book.volumeInfo.authors.forEach(author => {
                const p = document.createElement('p');
                p.textContent = `Author: ${author}`;

                div.append(p);
            });

            document.querySelector('main').append(div);
        }

        //Handles Google Books API search
        function handleAPIQuery(e){
            e.preventDefault();
            const search = e.target.search.value;
            
            fetch(`https://www.googleapis.com/books/v1/volumes?q=${search}&key=${apiKey}`)
            .then(res => res.json())
            .then(books => { 
                
                // Pessimistic Rendering
                books.items.forEach(renderBookResults)
            });
        }

    
    
    // Invoking functions    
        fetchResource('http://localhost:3000/stores/1')
        .then(store => {
            renderHeader(store)
            renderFooter(store)
        })
        .catch(e => console.error(e))
    
        fetchResource('http://localhost:3000/books')
        .then(books => books.forEach(renderBookCard))
        .catch(e => console.error(e))
    
        document.querySelector('#book-form').addEventListener('submit', handleForm)
        document.querySelector('#nav-search').addEventListener('click', handleRenderSearch)
})