// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
window.addEventListener('DOMContentLoaded', (event) => {
    const quoteList = document.getElementById('quote-list')
    const submitButton = document.querySelector('#new-quote-form')

    function addLikeListener(button) {
        button.addEventListener('click', (event) => {
            const thisLi = parseInt(event.target.parentNode.parentNode.id)
            fetch('http://localhost:3000/likes', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                  },
                body: JSON.stringify({
                    'quoteId': thisLi,
                })
            })
            .then(resp => resp.json())
            .then((resp) => {
                const buttonText = event.target.innerText
                const splitText = buttonText.split(': ')
                let numLikes = parseInt(splitText[1])
                event.target.innerHTML = `Likes: <span> ${numLikes += 1} </span>`
            })
        })
    }

    function addDeleteListener(button) {
        button.addEventListener('click', (event) => {
            const thisLi = parseInt(event.target.parentNode.parentNode.id)
            fetch(`http://localhost:3000/quotes/${thisLi}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                  },
                body: JSON.stringify({
                    'quoteId': thisLi,
                })
            })
            .then(resp => resp.json())
            .then((resp) => {
                event.target.parentNode.parentNode.remove()
            })
        })
    }

    submitButton.addEventListener('submit', (event) => {
        const newQuote = document.getElementById('new-quote').value
        const newAuthor = document.getElementById('author').value

        event.preventDefault();

        fetch('http://localhost:3000/quotes/', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
            body: JSON.stringify({
                'quote': newQuote,
                'author': newAuthor
                })
            })
            .then(resp => resp.json())
            .then( (resp) => {
                console.log(resp)
                const id = resp.id
                const quote = resp.quote
                const author = resp.author
                const likes = 0
                
                addNewQuote(id, quote, author, likes)
        })
    })

    function addNewQuote(id, quote, author, likes) {
        const newLi = document.createElement('li');
            newLi.setAttribute('class', 'quote-card');
            newLi.setAttribute('id', id)
            quoteList.appendChild(newLi)

            const newBlockQuote = document.createElement('blockquote');
            newBlockQuote.setAttribute('class', 'blockquote');
            newLi.appendChild(newBlockQuote)

            const newP = document.createElement('p');
            newP.setAttribute('class', 'mb-0');
            newP.innerText = quote;
            newBlockQuote.appendChild(newP)

            const newFooter = document.createElement('footer');
            newFooter.setAttribute('class', 'blockquote-footer');
            newFooter.innerText = author;
            newBlockQuote.appendChild(newFooter)

            const newBr = document.createElement('br');
            newBlockQuote.appendChild(newBr)

            const likeButton = document.createElement('button');
            likeButton.setAttribute('class', 'btn-success');
            likeButton.innerHTML = `Likes: <span> ${likes} </span>`;
            addLikeListener(likeButton);
            newBlockQuote.appendChild(likeButton);

            const deleteButton = document.createElement('button');
            deleteButton.setAttribute('class', 'btn-danger');
            deleteButton.innerText = "Delete"
            addDeleteListener(deleteButton)
            newBlockQuote.appendChild(deleteButton)
    }

    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(resp => resp.json())
    .then((resp) => {
        console.log(resp)
        for(let i = 0; i < resp.length; i++) {
            const id = resp[i].id
            const quote = resp[i].quote
            const author = resp[i].author
            const likes = resp[i].likes.length
            addNewQuote(id, quote, author, likes)
        }
    })
});