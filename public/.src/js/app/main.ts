import "./components/block"

declare global {
    interface Window {
        closeContentDynamic: any;
    }
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

let content_dynamic = document.querySelector('.load_dynamic')

const APP = async () => {

    let small = document.querySelector('.text_small')
    let text = document.querySelectorAll('.text_main')

    let open_content = document.querySelectorAll('.open_content')

    open_content.forEach(item => {

        item.addEventListener('click', async function (event) {

            event.preventDefault()

            let element: any = event.currentTarget.dataset.page

            let options: any =
            {
                method: 'GET',
                headers:
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                cache: 'default'

            }

            let data = await (await fetch(`/${element}`, options)).text()

            content_dynamic.innerHTML = data

            content_dynamic.classList.add('animate')

        })
    })

    // ANIMACION DE LA LETRAS
    small.classList.add('animate')

    for (const item of text) {

        await delay(800)
        item.classList.add('animate')
    }

}

window.closeContentDynamic = () => {

    content_dynamic.classList.remove('animate')
}

window.onload = APP
