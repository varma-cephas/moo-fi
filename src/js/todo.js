window.onload = function(){
    const input_todo_form = document.querySelector("#input_todo_form");
    const input_field = document.querySelector("#input_field");
    const cancel_btn = document.querySelector("#cancel_todo");

    input_todo_form.addEventListener("submit", e=>{
        e.preventDefault();
        const todo_item=document.createElement("li");
        const todo_checkbox=document.createElement("input");
        const todo_name=document.createElement("span");

        todo_checkbox.setAttribute("type", "checkbox");
        todo_checkbox.setAttribute("class", "todo_checkbox");

        const fd= new FormData(input_todo_form);
        fetch("/", {
            method: "POST",
            body: new URLSearchParams(fd),
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        todo_name.textContent=input_field.value;
        todo_name.style.cssText = `
            padding:"8px";
            cursor: pointer;
            color: white;
            display:block;
        `
        todo_checkbox.style.cssText = `
            display: block;
        `
        todo_item.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 0.5rem;
        `
        todo_item.append(todo_checkbox)
        todo_item.append(todo_name)

        document.getElementById("todo_list_item").append(todo_item)
        input_field.value="";
    })

    cancel_btn.addEventListener("click",()=>{
        document.getElementById("todo_form").style.display="none";
        document.getElementById("add_todo_btn").style.display="block";
    })

    const getTodo= async()=>{
            const request = await fetch("/todo_arr");
            const response = await request.json();
            if(response.length>=1){
                for(const item of response){
                    const todo_item=document.createElement("li");
                    const todo_checkbox=document.createElement("input");
                    const todo_name=document.createElement("span");

                    todo_checkbox.setAttribute("type", "checkbox");
                    todo_checkbox.setAttribute("class", "todo_checkbox");

                    todo_name.style.cssText = `
                    padding:"8px";
                    cursor: pointer;
                    color: white;
                    display:block;
                    `
                    todo_checkbox.style.cssText = `
                    display: block;
                    `
                    todo_item.style.cssText = `
                    display: flex;
                    justify-content: center;
                    gap: 0.5rem;
                    `

                    todo_name.textContent=item;
                    todo_item.append(todo_checkbox)
                    todo_item.append(todo_name)

                    document.getElementById("todo_list_item").append(todo_item)
                }
            }
        }

    getTodo()

    document.getElementById("add_todo_btn").addEventListener("click",()=>{
        document.getElementById("todo_form").style.display="block";
        document.getElementById("add_todo_btn").style.display="none";
    })

    document.getElementById("todo_list").addEventListener("change", e=>{
        const ename=e.target;
        if(ename.tagName==="INPUT"){
            ename.nextSibling.style.textDecoration="line-through";
            fetch("/remove-todo",{
                method: "PATCH",
                body: new URLSearchParams(ename.nextSibling.textContent),
            })
            setTimeout(()=>{
                ename.parentElement.remove()
            },1100)
        }
    })

    document.getElementById("todo_list").addEventListener("click", e=>{
        const ename=e.target;
        const update_todo = document.createElement("input");
        const done_updating_btn = document.createElement("button");
        const update_todo_container = document.createElement("div");

        if(ename.tagName==="SPAN"){
            ename.previousSibling.style.display="none";
            ename.style.display="none";
            update_todo.style.cssText=`
            border: 2px solid;
            display: block;
            margin-bottom: 0.56rem;
            `
            update_todo.value=ename.textContent;
            update_todo.placeholder="Update mission item";

            done_updating_btn.textContent="Update";
            done_updating_btn.style.cssText = `
            `

            update_todo_container.append(update_todo);
            update_todo_container.append(done_updating_btn);

            update_todo_container.style.cssText = `
                display: flex;
                gap: 1rem;
            `

            document.getElementById("todo_list_item").append(update_todo_container);
        }
    })
}