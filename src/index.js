document.addEventListener("DOMContentLoaded", (event) => {
    const quoteURL = `http://localhost:3000/quotes?_embed=likes`
    const postQuoteURL = `http://localhost:3000/quotes`
    const likesURL = `http://localhost:3000/likes`
    const quoteList = document.getElementById('quote-list')
    const userInput = document.getElementById('new-quote')
    const newQuoteForm = document.getElementById('new-quote-form')
    const authorInput = document.getElementById('author')
    const defaultLike = 0
    

fetch(quoteURL)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        showQuotes(data)
});
    
function showQuotes(data) {
    for (let quote of data) {
        const quoteID = quote.id
        const author = quote.author
        const singleQuote = quote.quote
        const quoteLikes = quote.likes
        var amountOfLikes = quoteLikes.length
        const li = document.createElement('li')
        const deleteBtn = document.createElement('button')
        deleteBtn.innerText = 'delete'
        const likeBtn = document.createElement('button')
        likeBtn.innerText = '❤️'
        li.innerHTML = `${singleQuote}      ` +  `${author}      ` + `${amountOfLikes}    `
        li.appendChild(likeBtn)
        li.appendChild(deleteBtn)
        quoteList.appendChild(li)

        deleteBtn.addEventListener("click", (event) => {
            fetch(`http://localhost:3000/quotes/${quoteID}`, {
                method: 'DELETE'
            });
        });

        addLike(likeBtn, quoteID);
    };

function addLike(likeBtn, quoteID) {
    likeBtn.addEventListener("click", (event) => {
        amountOfLikes++;
        
        fetch(likesURL, {
            method: 'POST',
            body: JSON.stringify({
                quoteId: quoteID
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }

        })
    })
};

function createQuote() {
    newQuoteForm.addEventListener("submit", function(event) {
        event.preventDefault()
        let usersQuote = userInput.value
        let usersAuthor = authorInput.value
        const li = document.createElement('li')
        const deleteBtn = document.createElement('button')
        deleteBtn.innerText = 'delete'
        const likeBtn = document.createElement('button')
        likeBtn.innerText = '❤️'
        li.innerHTML = `${usersQuote}      ` +  `${usersAuthor}      ` + `${defaultLike}    `
        li.appendChild(deleteBtn)
        li.appendChild(likeBtn)
        quoteList.appendChild(li)

        fetch(postQuoteURL, {
            method: 'POST',
            body: JSON.stringify({
                quote: usersQuote,
                author: usersAuthor,
                likes: defaultLike
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        

    });
}

createQuote();

};
// deliverables:
//1) 



});

// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
