const quotesUrl = 'http://localhost:3000/quotes?_embed=likes';
const baseQuoteUrl = 'http://localhost:3000/quotes';
const likesUrl = `http://localhost:3000/likes`;
const quoteList = document.getElementById("quote-list");
const submitBtn = document.querySelector('[type="submit"]')
const newQuote = document.getElementById("new-quote");
const authorInput = document.getElementById("author");

function fetchQuotes() {
    fetch(quotesUrl)
    .then(response => response.json())
    .then(quotesObj => {
        for (const quote of quotesObj) {
            listQuote(quote);
        }
    })
}

function createQuote(quote, author) {
    let data = {
        quote: quote,
        author: author,
        likes: []
    }

    let objConfig = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
    }

    fetch(baseQuoteUrl, objConfig)
    .then(response => response.json())
    .then(quoteObj => {
        listQuote(quoteObj);
    })
}

function deleteQuote(quote) {
    let data = {
        id: quote.id,
        quote: quote.quote,
        author: quote.author,
        likes: quote.likes
    }
    
    let objConfig = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }

    fetch(`${baseQuoteUrl}/${quote['id']}`, objConfig)
    .then(response => response.json())
    .then(quoteObj => {
        console.log(quoteObj);
        let quoteElement = document.querySelector(`[quote-list-id="${quote.id}"]`);
        quoteElement.parentNode.removeChild(quoteElement);
    })
}

function likeQuote(button, quote) {
    let data = {
        quoteId: quote.id
    }

    let objConfig = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
    }

    fetch(likesUrl, objConfig)
    .then(response => response.json())
    .then(likeObj => {
        console.log(likeObj);
        let currentLikes = button.innerText;
        console.log(currentLikes);
        parseInt(currentLikes);
        currentLikes++;
        button.innerText = `${currentLikes}`;
    })
}

function listQuote(quote) {
    const quoteItem = document.createElement("li");
    quoteItem.setAttribute("class", "quote-card");
    quoteItem.setAttribute("quote-list-id", `${quote.id}`)

    const blockQuote = document.createElement("blockquote")
    blockQuote.setAttribute("class", "blockquote");

    const quoteContent = document.createElement("p");
    quoteContent.setAttribute("class", "mb-0");
    quoteContent.innerText = quote['quote'];
    blockQuote.appendChild(quoteContent);

    const footer = document.createElement("footer");
    footer.setAttribute("class", "blockquote-footer");
    footer.innerText = quote['author'];
    blockQuote.appendChild(footer);

    const br = document.createElement("br");
    blockQuote.appendChild(br);

    const likeButton = document.createElement("button");
    likeButton.setAttribute("class", "btn-success");
    likeButton.setAttribute("data-quote-id", `${quote['id']}`);
    likeButton.innerText = `${quote['likes'].length}`
    createLikeEvent(likeButton, quote);
    blockQuote.appendChild(likeButton);

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "btn-danger")
    deleteButton.innerText = "Delete";
    createDeleteEvent(deleteButton, quote);
    blockQuote.appendChild(deleteButton);

    quoteItem.appendChild(blockQuote);
    quoteList.appendChild(quoteItem);
}

function createLikeEvent(button, quote) {
    button.addEventListener("click", event => {
        event.preventDefault();
        likeQuote(button, quote);
    })
}

function createDeleteEvent(button, quote) {
    button.addEventListener("click", event => {
        event.preventDefault();
        deleteQuote(quote);
    })
}

function createSubmitEvent(button, quote, author) {
    button.addEventListener("click", event => {
        event.preventDefault();
        createQuote(quote.value, author.value);
        newQuote.value = "";
        authorInput.value = "";
    })
}

document.addEventListener("DOMContentLoaded", event => {
    fetchQuotes();
    createSubmitEvent(submitBtn, newQuote, authorInput)
})