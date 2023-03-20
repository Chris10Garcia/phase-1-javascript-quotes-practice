const urlQuotes = "http://localhost:3000/quotes"
const urlLikes = "http://localhost:3000/likes"


/**********************************
*   BUILDS HTML QUOTE LIST CARDS  *
***********************************/

function buildCard(array){
    const ulQuoteList = document.getElementById('quote-list')
    ulQuoteList.innerHTML = ''

    array.forEach(obj => {
        const li = document.createElement('li')
        li.className = "quote-card"
        li.id = obj.id

        // easier to use innerHTML but need to take into account text injection secuirty hack
        li.innerHTML = 
            `
            <blockquote class="blockquote">
                <p class="mb-0">!!!!!REPLACE THIS TEXT!!!!!</p>
                <footer class="blockquote-footer">!!!!!REPLACE THIS TEXT!!!!!</footer>
                <br>
                <button class='btn-success'>Likes: <span>${obj.likes.length}</span></button>
                <button class='btn-danger'>Delete</button>
            </blockquote>
            `
        
        // this ensures text is properly assigned and not hackable
        li.querySelector('p').innerText = obj.quote
        li.querySelector('footer').innerText = obj.author

        createLikeEvent.call(li)
        createDeleteEvent.call(li)

        // create event listener for delete button
        ulQuoteList.append(li)
    })

}

/**********************************
*   Update data functions*******  *
***********************************/

function updateLikes(id){
    const likeObj = 
    {
        quoteId : parseInt(id, 10),
        createdAt : Date.now()
    }
    postLikeData.call(likeObj)
}

function updateForm(){
    const quoteObj = {
        quote: this.quote.value,
        author: this.author.value
    }
    postQuoteData.call(quoteObj)
}


/**********************************
*   Fetch data related functions   *
***********************************/


function getData(){
    fetch(urlQuotes + "?_embed=likes")
        .then(resp => resp.json())
        .then(data => buildCard(data))
}


function postQuoteData(){
    
    fetch(urlQuotes, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(this)
    })
    .then(resp => resp.json())
    .then(() => getData())
}

function postLikeData(){
    fetch(urlLikes, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(this)
    })
    .then(resp => resp.json())
    .then(() => getData())
}

function deleteQuoteData(id){
    fetch(urlQuotes + "/" + id, {method: 'DELETE'})
    .then(resp => resp.json())
    .then(()=> getData())
}

/**********************************
*   addEventListener Functions    *
***********************************/

function createLikeEvent(){
    this.querySelector('button.btn-success').addEventListener('click', e => updateLikes(e.target.parentNode.parentNode.id))
}

function createDeleteEvent(){
    this.querySelector('button.btn-danger').addEventListener('click', e => deleteQuoteData(e.target.parentNode.parentNode.id))
}

function createFormEvent(){
    this.addEventListener('submit', e =>{
        e.preventDefault()
        updateForm.call(e.target)
    })
}

/**********************************
*   Start function                *
***********************************/

function main(){
    getData()
    createFormEvent.call(document.querySelector('#new-quote-form'))
}

main ()