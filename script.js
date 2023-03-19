const mainContent = document.querySelector('.main_content')
const filter_con = document.querySelector('.filter_con')
const btn_span = document.querySelector('.btn_span')
const clear_btn = document.getElementById("clear")


//get the json data locally with fetch
//work with the data
fetch('data.json')
.then((response) => {return response.json()})
.then((data) => addData(data))


//main function
function addData(data) {
    addItems(data)

    const new_items = document.querySelectorAll('.date')
    const features =document.querySelectorAll('.feature')
    const stacks = document.querySelectorAll('.stack')

    


    langDynamic (data,stacks)
    filterNew(new_items,features,data)


//get the span items from the langDynamic func
    const spans = document.querySelectorAll('.person_stack')
//
    getStack (spans)
    
}


//map thro the the data and add as HTML content
function addItems(data) {
    let items = data.map((item)=> {
        return `<div class="item" id="${item.id}">
        <div class="profile_img">
            <img src="${item.logo}" alt="">
        </div>
        <div class="about_person">
            <div class="row_1">
                <span class="position">
                    ${item.company}
                </span>
                <span class="date" id="${item.id}">
                    
                </span>
                <span class="feature" id="${item.id}">
                    
                </span>
            </div>
            <div class="row_2 role">
                ${item.position}
            </div>
            <div class="row_3">
                <span class="last_active">
                    ${item.postedAt}
                </span>
                <span class="dot">
                    .
                </span>
                <span class="mode">
                    ${item.contract}
                </span>
                <span class="dot">
                    .
                </span>
                <span class="country">
                    ${item.location}
                </span>
            </div>
        </div>
        <article class="stack">
            
        </article>
    </div>`
    }).join('')
    mainContent.innerHTML = items
}



//create an empty array and add the item clicked "conditionally" into the array
//follow thro the functions
function getStack (spans) {
    let total_stack = []
    spans.forEach((span) => {
        span.addEventListener('click', (e) => {
            filter_con.style.display = 'flex'
            let target= e.currentTarget 
            let rel = target.innerText

            const stacks = document.querySelectorAll('.stack')
            

            if (total_stack.includes(rel)) {
                return
            }else {
                total_stack.push(rel)
            }

            updateDom(total_stack)
            filterOnClick(stacks,total_stack)

            const clear_btns = document.querySelectorAll('.clear_btn')
            deleteItem(clear_btns,total_stack) 
        })
    })
//    clear(total_stack)
}



//when we click the clear btn for any item, we get the id of 
//the selected item,hide it,remove the selected item from the
//the total stack array
//get all the btns, get the length, loop thro the btns and check for
//the ".hide" classlist, if available we decrease the var for the length,
//if the num is zero we know that every element is hidden hence, a function
//similar to the clear function should be called
//we pass this value to the filteronclick
//PS: ths was me forcefully tryin to hide the filter div after trying
//to get when the total stack length is 0 and hide the filter con ):
function deleteItem(clear_btns,total_stack) {
    clear_btns.forEach(btn => {
        btn.addEventListener('click',(e) => {
            let selected_item = e.currentTarget
            let selected_id = selected_item.id
            selected_item.parentElement.classList.add("hide")
            total_stack.splice(selected_id,1)
            const spans = document.querySelectorAll('.btn')
            const stacks = document.querySelectorAll('.stack')
            let num = spans.length
            spans.forEach(span => {
                if(span.classList.contains("hide")) {
                    num --
                }else {
                    num = num
                }
            })
            filterOnClick(stacks,total_stack,num)
            console.log(total_stack,total_stack.length)
            
            // console.log(num)
            
            
        })
    } )
} 




//loop thro the items in the total stack and add the html content to the "btn_span"
function updateDom (total_stack) {
    const stack_result = total_stack.map((i,index) => {
        return `<div class="btn">
        ${i}
        <button  class="clear_btn" id=${index}><img src="images/icon-remove.svg" alt=""></button>
    </div>`
    
    }).join('')
    btn_span.innerHTML = stack_result
}




//create a function to loop thro each language in each list and add
// as html content
let number = 0;
function langDynamic (data,stacks) {
    data.forEach((val,index) => {
        let langs = val.languages
        const result = langs.map((lang)=> {
            number ++
            // return `<span>${lang}</span>`
            const span = document.createElement('span')
            span.classList.add('person_stack')
            span.id = number
            span.innerText = lang
            return span.outerHTML
        }).join('')
        // console.log(result)
        stacks[index].innerHTML = result
    })
    
}


//loop thro each stack, set a variable for the length of the stack,
//within the stack, loop thro the values, if an item in the stack
//is not included in the total stack, we decrease the set variable by one.
//this way if add the end of the day the variable does
//not equal the length of the stack we display none
//when the num is 0, we call the clear function
function filterOnClick(stacks,total_stack,num) {
    stacks.forEach((stack) => {
        const vals = stack.querySelectorAll('.person_stack')
        let quant = vals.length

        vals.forEach((val)=> {
            if (total_stack.includes(val.innerText)) {
                quant = quant
            }else {
                quant--
            }
            return quant
        })
        // console.log(quant)
        if (quant != total_stack.length) {
            stack.parentElement.style.display = "none";
        }else{
            stack.parentElement.style.display = "flex";
        }
        if(num == 0) {
            clear(filter_con,total_stack,stack)
        }

        // total_stack.length == 0 ? filter_con.style.display = "none": filter_con.style.display = "flex"
        clear_btn.addEventListener('click', () => {
            clear(filter_con,total_stack,stack)
        })
    })
}


//when the clear button is clicked we set the total stack to 0
//we hide the filter con and display everyother element
function clear (filter_con,total_stack,stack) {
    filter_con.style.display = 'none'
    total_stack.length = 0
    stack.parentElement.style.display = "flex";
}





//filter the "new" and "featured" item in each
//data, check for true or false and add based on result
function filterNew (new_items,features,data) {
    new_items.forEach((new_item) => {
        let value = data[new_item.id-1].new

        if (value) {
            value = "new"
            new_item.innerText = value
        }else {
            new_item.style.display = "none"
        }
    })

    features.forEach((feature) => {
        let ans = data[feature.id-1].featured

        if (ans) {
            ans = "featured"
            feature.innerText = ans
        }else {
            feature.style.display = "none"
        }
    })
}
